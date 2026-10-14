const express=require('express'),path=require('path'),{hash,verify,token,th}=require('./security'),{ROLES,AREAS,has}=require('./perms');
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function createApp(db,cfg){
 const app=express(),now=()=>Date.now(),ttl=cfg.sessionMinutes*60000,tries=new Map();
 const audit=(u,a,t)=>db.prepare('INSERT INTO audit_log(actor_id,action,target,at) VALUES(?,?,?,?)').run(u?u.id:null,a,t||'',now());
 const cookie=(v,age)=>`sid=${v}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${cfg.secure?'; Secure':''}`;
 app.disable('x-powered-by');app.use(express.json({limit:'1mb'}));
 app.use((q,r,n)=>{r.set({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY'});if(q.path.startsWith('/api'))r.set('Cache-Control','no-store');n()});
 app.use((req,res,next)=>{const m=/(?:^|;\s*)sid=([a-f0-9]+)/.exec(req.headers.cookie||'');
  if(m){const s=db.prepare('SELECT s.id sid,s.expires_at,u.id uid,u.name,u.email,u.role,u.active FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?').get(th(m[1]));
   if(s&&s.expires_at>now()&&s.active){req.user={id:s.uid,name:s.name,email:s.email,role:s.role};db.prepare('UPDATE sessions SET expires_at=? WHERE id=?').run(now()+ttl,s.sid)}}next()});
 const deny=(c,e)=>(q,r)=>r.status(c).json({error:e});
 const auth=(q,r,n)=>q.user?n():deny(401,'Sign in required')(q,r);
 const area=a=>[auth,(q,r,n)=>AREAS[a].includes(q.user.role)?n():deny(403,'Not allowed')(q,r)];
 const need=p=>(q,r,n)=>has(q.user.role,p)?n():deny(403,'Not allowed')(q,r);

 app.get('/api/health',(q,r)=>{db.prepare('SELECT 1').get();r.json({ok:true})});
 app.post('/api/auth/login',(req,res)=>{const{email='',password='',portal='student'}=req.body||{},k=req.ip+String(email).toLowerCase(),t=tries.get(k)||{n:0,u:0};
  if(t.n>=5&&t.u>now())return res.status(429).json({error:'Too many attempts. Try again in 15 minutes'});
  const u=db.prepare('SELECT * FROM users WHERE email=?').get(String(email).toLowerCase());
  if(!u||!u.active||!AREAS[portal]||!AREAS[portal].includes(u.role)||!verify(String(password),u.pw_hash)){tries.set(k,{n:t.n+1,u:now()+9e5});audit(null,'login_failed',email);return res.status(401).json({error:'Wrong email or password'})}
  tries.delete(k);const tk=token();db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(th(tk),u.id,now()+ttl);audit(u,'login');
  res.set('Set-Cookie',cookie(tk,ttl/1000)).json({id:u.id,name:u.name,role:u.role})});
 app.post('/api/auth/logout',(req,res)=>{const m=/sid=([a-f0-9]+)/.exec(req.headers.cookie||'');if(m)db.prepare('DELETE FROM sessions WHERE token_hash=?').run(th(m[1]));res.set('Set-Cookie',cookie('',0)).json({ok:true})});
 app.get('/api/auth/me',auth,(q,r)=>r.json(q.user));
 app.post('/api/auth/forgot',(req,res)=>{const u=db.prepare('SELECT * FROM users WHERE email=? AND active=1').get(String((req.body||{}).email||'').toLowerCase()),out={ok:true};
  if(u){const tk=token();db.prepare('INSERT INTO reset_tokens VALUES(?,?,?,0)').run(th(tk),u.id,now()+18e5);audit(u,'reset_requested');
   if(cfg.dev){out.devToken=tk;console.log('Reset token for',u.email,tk)} /* TODO: send by email in a later stage */}
  res.json(out)});
 app.post('/api/auth/reset',(req,res)=>{const{token:tk='',password=''}=req.body||{};if(String(password).length<8)return res.status(400).json({error:'Password must be at least 8 characters'});
  const t=db.prepare('SELECT * FROM reset_tokens WHERE token_hash=? AND used=0 AND expires_at>?').get(th(String(tk)),now());if(!t)return res.status(400).json({error:'Reset link is invalid or expired'});
  db.transaction(()=>{db.prepare('UPDATE users SET pw_hash=? WHERE id=?').run(hash(password),t.user_id);db.prepare('UPDATE reset_tokens SET used=1 WHERE token_hash=?').run(t.token_hash);db.prepare('DELETE FROM sessions WHERE user_id=?').run(t.user_id)})();
  audit({id:t.user_id},'password_reset');res.json({ok:true})});

 app.get('/api/student/me',area('student'),(q,r)=>r.json(q.user));
 app.get('/api/instructor/me',area('instructor'),(q,r)=>r.json(q.user));
 app.get('/api/admin/me',area('admin'),(q,r)=>r.json({...q.user,permissions:ROLES[q.user.role]}));
 app.get('/api/admin/staff',area('admin'),need('staff:read'),(q,r)=>r.json(db.prepare("SELECT id,name,email,role,active FROM users WHERE role!='student'").all()));
 app.post('/api/admin/staff',area('admin'),need('staff:write'),(req,res)=>{const{name='',email='',password='',role=''}=req.body||{};
  if(!name.trim()||!EMAIL.test(email)||password.length<8||!ROLES[role])return res.status(400).json({error:'Name, valid email, 8+ character password and a valid role are required'});
  try{const i=db.prepare('INSERT INTO users(name,email,pw_hash,role) VALUES(?,?,?,?)').run(name.trim(),email.toLowerCase(),hash(password),role);audit(req.user,'staff_created',email);res.status(201).json({id:Number(i.lastInsertRowid)})}
  catch{res.status(409).json({error:'Email already in use'})}});
 app.patch('/api/admin/staff/:id/role',area('admin'),need('staff:write'),(req,res)=>{const id=+req.params.id,role=(req.body||{}).role;
  if(id===req.user.id)return res.status(403).json({error:'You cannot change your own role'});
  if(!ROLES[role])return res.status(400).json({error:'Invalid role'});
  const r=db.prepare("UPDATE users SET role=? WHERE id=? AND role!='student'").run(role,id);if(!r.changes)return res.status(404).json({error:'Staff member not found'});
  db.prepare('DELETE FROM sessions WHERE user_id=?').run(id);audit(req.user,'role_changed',id+':'+role);res.json({ok:true})});

 require('./content')(app,{db,area,need,audit,hash,EMAIL});
 app.use('/api',deny(404,'Not found'));
 app.use('/server',deny(404,'Not found'));
 app.use(express.static(path.join(__dirname,'..','..')));
 app.use((err,q,r,n)=>{console.error(err);r.status(err.status||500).json({error:cfg.dev?err.message:'Something went wrong'})});
 return app}
module.exports={createApp};
