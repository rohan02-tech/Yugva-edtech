const{openDb}=require('./db'),{hash}=require('./security'),prod=process.env.NODE_ENV==='production';
const db=openDb(process.env.DB_PATH||'./data/yugva.db'),add=(n,e,p,r)=>db.prepare('INSERT OR IGNORE INTO users(name,email,pw_hash,role) VALUES(?,?,?,?)').run(n,e,hash(p),r);
const e=process.env.SEED_ADMIN_EMAIL,p=process.env.SEED_ADMIN_PASSWORD;if(!e||!p||p.length<10)throw new Error('Set SEED_ADMIN_EMAIL and a 10+ character SEED_ADMIN_PASSWORD');
add('Super Admin',e,p,'superadmin');
if(!prod){for(const r of['academic','instructor','counsellor','finance','student'])add('Test '+r,r+'@yugva.in','Test@12345',r);console.log('Dev test users created (password Test@12345)')}
console.log('Seed done');
