// Stage 2: students, courses, mentors, enrollments
module.exports=function(app,{db,area,need,audit,hash,EMAIL}){
 const J=s=>{try{return JSON.parse(s)}catch{return[]}},arr=a=>Array.isArray(a)?a.map(x=>String(x).trim()).filter(Boolean).slice(0,100):null;
 const IMG=/^(data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+|assets\/[\w.\-]+)?$/,URL_=/^(https?:\/\/\S+)?$/,bad=(r,m)=>r.status(400).json({error:m}),nf=r=>r.status(404).json({error:'Not found'});
 const SEL='SELECT c.*,g.name category FROM courses c LEFT JOIN categories g ON g.id=c.category_id';
 const mentorsOf=id=>db.prepare('SELECT m.id,m.name,m.info,m.image FROM mentors m JOIN course_mentors cm ON cm.mentor_id=m.id WHERE cm.course_id=?').all(id);
 const shape=c=>{const m=mentorsOf(c.id);return{id:c.id,slug:c.slug,name:c.name,category:c.category,price:c.price,months:c.months,status:c.status,description:c.description,image:c.image,syllabus:J(c.syllabus),skills:J(c.skills),outcomes:J(c.outcomes),mentors:m,mentorIds:m.map(x=>x.id)}};
 const content=(id,full)=>({modules:db.prepare('SELECT id,title FROM modules WHERE course_id=? ORDER BY position,id').all(id).map(m=>({...m,lessons:db.prepare('SELECT id,title'+(full?',video_url':'')+' FROM lessons WHERE module_id=? ORDER BY position,id').all(m.id)})),resources:full?db.prepare('SELECT id,title,url FROM resources WHERE course_id=?').all(id):[]});
 const cat=n=>{n=String(n||'').trim();if(!n)return null;db.prepare('INSERT OR IGNORE INTO categories(name) VALUES(?)').run(n);return db.prepare('SELECT id FROM categories WHERE name=?').get(n).id};
 const W=[area('admin'),need('courses:write')],S=p=>[area('admin'),need(p)];

 // public: published only, no video links
 app.get('/api/courses',(q,r)=>r.json(db.prepare(SEL+" WHERE c.status='published' ORDER BY c.name").all().map(shape)));
 app.get('/api/courses/:slug',(q,r)=>{const c=db.prepare(SEL+" WHERE c.slug=? AND c.status='published'").get(q.params.slug);c?r.json({...shape(c),...content(c.id,false)}):nf(r)});
 app.get('/api/mentors',(q,r)=>r.json(db.prepare('SELECT * FROM mentors ORDER BY id').all()));
 // student: own active enrollments in published courses only
 const mine=(uid,slug)=>db.prepare(SEL+" JOIN enrollments e ON e.course_id=c.id WHERE e.user_id=? AND e.status='active' AND c.status='published'"+(slug?' AND c.slug=?':'')).all(...(slug?[uid,slug]:[uid]));
 app.get('/api/student/courses',area('student'),(q,r)=>r.json(mine(q.user.id).map(shape)));
 app.get('/api/student/courses/:slug',area('student'),(q,r)=>{const c=mine(q.user.id,q.params.slug)[0];c?r.json({...shape(c),...content(c.id,true)}):nf(r)});

 // admin: students
 app.get('/api/admin/students',...S('students:read'),(q,r)=>{const s='%'+(q.query.q||'')+'%',st=q.query.status,en=db.prepare('SELECT e.id,e.status,c.id course_id,c.name FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.user_id=?');
  r.json(db.prepare("SELECT id,name,email,phone,active FROM users WHERE role='student' AND (name LIKE ? OR email LIKE ?)"+(st=='active'?' AND active=1':st=='inactive'?' AND active=0':'')+' ORDER BY id DESC').all(s,s).map(u=>({...u,enrollments:en.all(u.id)})))});
 app.post('/api/admin/students',...S('students:write'),(q,r)=>{const{name='',email='',password='',phone=''}=q.body||{};
  if(!name.trim()||!EMAIL.test(email)||password.length<8)return bad(r,'Name, valid email and an 8+ character password are required');
  try{const i=db.prepare("INSERT INTO users(name,email,pw_hash,role,phone) VALUES(?,?,?,'student',?)").run(name.trim(),email.toLowerCase(),hash(password),String(phone).slice(0,20));audit(q.user,'student_created',email);r.status(201).json({id:Number(i.lastInsertRowid)})}catch{r.status(409).json({error:'Email already in use'})}});
 app.patch('/api/admin/students/:id',...S('students:write'),(q,r)=>{const b=q.body||{},u=db.prepare("SELECT * FROM users WHERE id=? AND role='student'").get(+q.params.id);if(!u)return nf(r);
  const name=String(b.name??u.name).trim(),email=String(b.email??u.email).toLowerCase(),active=b.active===undefined?u.active:(b.active?1:0);
  if(!name||!EMAIL.test(email))return bad(r,'Name and a valid email are required');
  try{db.prepare('UPDATE users SET name=?,email=?,phone=?,active=? WHERE id=?').run(name,email,String(b.phone??u.phone).slice(0,20),active,u.id)}catch{return r.status(409).json({error:'Email already in use'})}
  if(!active)db.prepare('DELETE FROM sessions WHERE user_id=?').run(u.id);audit(q.user,'student_updated',u.id+(active?'':':deactivated'));r.json({ok:true})});
 app.post('/api/admin/students/:id/enroll',...S('students:write'),(q,r)=>{const u=db.prepare("SELECT id FROM users WHERE id=? AND role='student' AND active=1").get(+q.params.id),c=db.prepare("SELECT id FROM courses WHERE id=? AND status!='archived'").get(+(q.body||{}).courseId);
  if(!u||!c)return bad(r,'Active student and non-archived course are required');
  try{db.prepare('INSERT INTO enrollments(user_id,course_id,created_at) VALUES(?,?,?)').run(u.id,c.id,Date.now());audit(q.user,'enrolled',u.id+':'+c.id);r.status(201).json({ok:true})}catch{r.status(409).json({error:'Already enrolled in this course'})}});
 app.patch('/api/admin/enrollments/:id',...S('students:write'),(q,r)=>{const s=(q.body||{}).status;if(!['active','inactive'].includes(s))return bad(r,'Invalid status');
  if(!db.prepare('UPDATE enrollments SET status=? WHERE id=?').run(s,+q.params.id).changes)return nf(r);audit(q.user,'enrollment_'+s,q.params.id);r.json({ok:true})});

 // admin: courses
 app.get('/api/admin/categories',...S('courses:read'),(q,r)=>r.json(db.prepare('SELECT * FROM categories ORDER BY name').all()));
 app.get('/api/admin/courses',...S('courses:read'),(q,r)=>r.json(db.prepare(SEL+' ORDER BY c.id DESC').all().map(c=>({...shape(c),...content(c.id,true)}))));
 app.post('/api/admin/courses',...W,(q,r)=>{const n=String((q.body||{}).name||'').trim(),slug=n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');if(!slug)return bad(r,'Course name is required');
  try{const i=db.prepare('INSERT INTO courses(slug,name,category_id) VALUES(?,?,?)').run(slug,n,cat((q.body||{}).category));audit(q.user,'course_created',slug);r.status(201).json({id:Number(i.lastInsertRowid)})}catch{r.status(409).json({error:'A course with this name already exists'})}});
 app.patch('/api/admin/courses/:id',...W,(q,r)=>{const b=q.body||{},id=+q.params.id,c=db.prepare('SELECT * FROM courses WHERE id=?').get(id);if(!c)return nf(r);
  const price=b.price===undefined?c.price:Number(b.price),months=b.months===undefined?c.months:Number(b.months),name=String(b.name??c.name).trim(),image=b.image===undefined?c.image:b.image;
  if(!name||!Number.isInteger(price)||price<0||!Number.isInteger(months)||months<1||months>36)return bad(r,'Check name, price (0 or more) and months (1-36)');
  if(typeof image!=='string'||!IMG.test(image)||image.length>900000)return bad(r,'Image must be a png, jpeg or webp under 650 KB');
  const L=k=>b[k]===undefined?c[k]:JSON.stringify(arr(b[k])||[]);
  db.transaction(()=>{db.prepare('UPDATE courses SET name=?,category_id=?,price=?,months=?,description=?,image=?,syllabus=?,skills=?,outcomes=? WHERE id=?').run(name,b.category===undefined?c.category_id:cat(b.category),price,months,String(b.description??c.description).slice(0,5000),image,L('syllabus'),L('skills'),L('outcomes'),id);
   if(Array.isArray(b.mentorIds)){db.prepare('DELETE FROM course_mentors WHERE course_id=?').run(id);for(const m of b.mentorIds)db.prepare('INSERT OR IGNORE INTO course_mentors SELECT ?,id FROM mentors WHERE id=?').run(id,+m)}})();
  audit(q.user,'course_updated',c.slug);r.json({ok:true})});
 const NEXT={draft:['published','archived'],published:['draft','archived'],archived:['draft']};
 app.patch('/api/admin/courses/:id/status',...W,(q,r)=>{const c=db.prepare('SELECT * FROM courses WHERE id=?').get(+q.params.id),s=(q.body||{}).status;if(!c)return nf(r);
  if(!(NEXT[c.status]||[]).includes(s))return bad(r,`Cannot move a ${c.status} course to ${s}`);
  if(s==='published'&&(!c.category_id||!c.description.trim()))return bad(r,'Add a category and description before publishing');
  db.prepare('UPDATE courses SET status=? WHERE id=?').run(s,c.id);audit(q.user,'course_'+s,c.slug);r.json({ok:true})});
 app.post('/api/admin/courses/:id/modules',...W,(q,r)=>{const t=String((q.body||{}).title||'').trim();if(!t)return bad(r,'Title is required');if(!db.prepare('SELECT 1 FROM courses WHERE id=?').get(+q.params.id))return nf(r);
  r.status(201).json({id:Number(db.prepare('INSERT INTO modules(course_id,title,position) VALUES(?,?,(SELECT COALESCE(MAX(position),0)+1 FROM modules WHERE course_id=?))').run(+q.params.id,t,+q.params.id).lastInsertRowid)})});
 app.post('/api/admin/modules/:id/lessons',...W,(q,r)=>{const t=String((q.body||{}).title||'').trim(),u=String((q.body||{}).videoUrl||'').trim();if(!t||!URL_.test(u))return bad(r,'Title and a valid http(s) video link are required');if(!db.prepare('SELECT 1 FROM modules WHERE id=?').get(+q.params.id))return nf(r);
  r.status(201).json({id:Number(db.prepare('INSERT INTO lessons(module_id,title,video_url,position) VALUES(?,?,?,(SELECT COALESCE(MAX(position),0)+1 FROM lessons WHERE module_id=?))').run(+q.params.id,t,u,+q.params.id).lastInsertRowid)})});
 app.post('/api/admin/courses/:id/resources',...W,(q,r)=>{const t=String((q.body||{}).title||'').trim(),u=String((q.body||{}).url||'').trim();if(!t||!u||!URL_.test(u))return bad(r,'Title and a valid http(s) link are required');if(!db.prepare('SELECT 1 FROM courses WHERE id=?').get(+q.params.id))return nf(r);
  r.status(201).json({id:Number(db.prepare('INSERT INTO resources(course_id,title,url) VALUES(?,?,?)').run(+q.params.id,t,u).lastInsertRowid)})});
 const del=(p,t,a)=>app.delete(p,...W,(q,r)=>{if(!db.prepare(`DELETE FROM ${t} WHERE id=?`).run(+q.params.id).changes)return nf(r);audit(q.user,a,q.params.id);r.json({ok:true})});
 del('/api/admin/modules/:id','modules','module_deleted');del('/api/admin/lessons/:id','lessons','lesson_deleted');del('/api/admin/resources/:id','resources','resource_deleted');del('/api/admin/mentors/:id','mentors','mentor_deleted');
 // admin: mentors
 const mv=b=>{const n=String(b.name||'').trim(),i=String(b.info||'').slice(0,200),im=b.image===undefined?undefined:String(b.image);return!n||(im!==undefined&&(!IMG.test(im)||im.length>900000))?null:{n,i,im}};
 app.post('/api/admin/mentors',...W,(q,r)=>{const m=mv(q.body||{});if(!m)return bad(r,'Name is required; image must be png, jpeg or webp under 650 KB');r.status(201).json({id:Number(db.prepare('INSERT INTO mentors(name,info,image) VALUES(?,?,?)').run(m.n,m.i,m.im||'').lastInsertRowid)})});
 app.patch('/api/admin/mentors/:id',...W,(q,r)=>{const m=mv(q.body||{});if(!m)return bad(r,'Name is required; image must be png, jpeg or webp under 650 KB');
  if(!db.prepare('UPDATE mentors SET name=?,info=?,image=COALESCE(?,image) WHERE id=?').run(m.n,m.i,m.im??null,+q.params.id).changes)return nf(r);audit(q.user,'mentor_updated',q.params.id);r.json({ok:true})});
};
