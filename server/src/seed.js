const{openDb}=require('./db'),{hash}=require('./security'),prod=process.env.NODE_ENV==='production';
const db=openDb(process.env.DB_PATH||'./data/yugva.db'),add=(n,e,p,r)=>db.prepare('INSERT OR IGNORE INTO users(name,email,pw_hash,role) VALUES(?,?,?,?)').run(n,e,hash(p),r);
const e=process.env.SEED_ADMIN_EMAIL,p=process.env.SEED_ADMIN_PASSWORD;if(!e||!p||p.length<10)throw new Error('Set SEED_ADMIN_EMAIL and a 10+ character SEED_ADMIN_PASSWORD');
add('Super Admin',e,p,'superadmin');
if(!prod){for(const r of['academic','instructor','counsellor','finance','student'])add('Test '+r,r+'@yugva.in','Test@12345',r);console.log('Dev test users created (password Test@12345)')}
console.log('Seed done');
// Public-site content (only when empty)
if(!db.prepare('SELECT COUNT(*) n FROM courses').get().n){
 const cid=n=>{db.prepare('INSERT OR IGNORE INTO categories(name) VALUES(?)').run(n);return db.prepare('SELECT id FROM categories WHERE name=?').get(n).id};
 [['Anita Rao','Ex-Infosys, 12 yrs'],['Rahul Menon','Cloud Architect, AWS'],['Sneha Kulkarni','Lead Designer, Zoho'],['Vikram Shah','Data Scientist, Accenture']].forEach(m=>db.prepare('INSERT INTO mentors(name,info) VALUES(?,?)').run(...m));
 const I={cyber:'image0.jpeg',graphic:'image1.jpeg',ai:'image2.jpeg',salesforce:'image4.jpg','data-science':'data-science.png',java:'java.jpg',supply:'supplychain.jpg'};
 [['cyber','Cyber Security','Tech',14999],['ai','Artificial Intelligence','Tech',15999],['aws','AWS','Tech',11999],['iot','Internet of Things (IoT)','Tech',12999],['uiux','UI & UX','Design',10999],['salesforce','Salesforce','Tech',13999],['python','Python','Tech',8999],['ml','Machine Learning','Tech',15999],['graphic','Graphic Designing','Design',9999],['web','Web Development','Tech',12999],['arvr','AR & VR','Tech',14999],['blockchain','Block Chain','Tech',13999],['android','Android App Development','Tech',12999],['data-science','Data Science','Tech',14999],['robotics','Robotics','Tech',15999],['java','Java','Tech',9999],['supply','Supply Chain Management','Management',10999]]
 .forEach(([s,n,c,p])=>db.prepare("INSERT INTO courses(slug,name,category_id,price,months,status,description,image) VALUES(?,?,?,?,?,'published',?,?)").run(s,n,cid(c),p,s=='python'?3:5,'Live and recorded classes, an industry project and placement support.',I[s]?'assets/'+I[s]:''));
 console.log('Courses and mentors seeded')}
