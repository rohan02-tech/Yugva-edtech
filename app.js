/* Yugva – front-end only. Data lives in localStorage (test users). Edit SEED below to change content. */
const $=(s,e=document)=>e.querySelector(s), A=document.getElementById('app'), K='yugva_db_v2', H6=6*3600e3;
const CATS={Tech:'code',Design:'palette',Management:'insights'};
const IMG={cyber:'image0.jpeg',graphic:'image1.jpeg',ai:'image2.jpeg',salesforce:'image4.jpg','data-science':'data-science.png',java:'java.jpg',supply:'supplychain.jpg'};
const SEED={
 workshop:{title:'Placement Prep Workshop',date:'This Saturday, 11 AM',link:'https://forms.google.com',joined:248},
 courses:[
 ['cyber','Cyber Security','Tech',14999,'shield_lock'],['ai','Artificial Intelligence','Tech',15999,'smart_toy'],['aws','AWS','Tech',11999,'cloud'],
 ['iot','Internet of Things (IoT)','Tech',12999,'sensors'],['uiux','UI & UX','Design',10999,'draw'],['salesforce','Salesforce','Tech',13999,'business_center'],
 ['python','Python','Tech',8999,'terminal'],['ml','Machine Learning','Tech',15999,'model_training'],['graphic','Graphic Designing','Design',9999,'brush'],
 ['web','Web Development','Tech',12999,'web'],['arvr','AR & VR','Tech',14999,'view_in_ar'],['blockchain','Block Chain','Tech',13999,'link'],
 ['android','Android App Development','Tech',12999,'android'],['data-science','Data Science','Tech',14999,'analytics'],['robotics','Robotics','Tech',15999,'precision_manufacturing'],
 ['java','Java','Tech',9999,'coffee'],['supply','Supply Chain Management','Management',10999,'local_shipping']
 ].map(([slug,name,cat,price,icon])=>({slug,name,cat,price,icon,months:slug=='python'?3:5,img:IMG[slug]?'assets/'+IMG[slug]:'',status:'published',desc:'',syl:[],skills:[],outs:[],mentors:[],videos:[]})),
 mentors:[['Anita Rao','Ex-Infosys, 12 yrs'],['Rahul Menon','Cloud Architect, AWS'],['Sneha Kulkarni','Lead Designer, Zoho'],['Vikram Shah','Data Scientist, Accenture']].map((m,i)=>({id:'m'+i,name:m[0],info:m[1],img:''})),
 users:[{name:'Super Admin',email:'admin@yugva.in',pw:'admin123',role:'superadmin',enr:{}},...['academic','instructor','counsellor','finance'].map(r=>({name:'Test '+r,email:r+'@yugva.in',pw:r+'123',role:r,enr:{}})),{name:'Test Student',email:'test@yugva.in',pw:'test123',role:'student',enr:{},streak:0,last:'',ach:[]}]
};
const REVIEWS=[['Rohit S.','Placed at TCS','Mentors explained real projects, not just theory. Got placed in 4 months.'],['Seema P.','Data Analyst','The 6-hour video drip kept me consistent. Streaks are addictive!'],['Aman K.','Cloud Engineer','Mock interviews made the real one feel easy.'],['Divya R.','UI Designer','Portfolio reviews every week changed my work completely.']];
const FAQ=[['Are the certificates recognised?','Yes, certificates are recognised by MSME and issued by an ISO-approved organisation.'],['Do I get placement help?','Resume building, mock interviews and referrals to our hiring partners.'],['Can I try before enrolling?','Book a free session from the home page.'],['How do recorded lessons unlock?','Watch one video; the next unlocks after 6 hours.']];
let db=JSON.parse(localStorage.getItem(K)||'null')||SEED; const save=()=>localStorage.setItem(K,JSON.stringify(db));
let me=JSON.parse(sessionStorage.getItem('me')||'null'); const user=()=>me&&db.users.find(u=>u.email==me);
const course=s=>db.courses.find(c=>c.slug==s), toast=t=>{const e=$('#toast');e.textContent=t;e.className='s';setTimeout(()=>e.className='',2400)};
const media=c=>c.img?`<img src="${c.img}" alt="${c.name}">`:`<span class="material-symbols-rounded">${c.icon}</span>`;
const enrolled=s=>db.users.filter(u=>u.enr&&u.enr[s]).length+40+s.length*7;
const mentorsFor=s=>{const c=course(s),sel=db.mentors.filter(m=>(c.mentors||[]).includes(m.id));return sel.length?sel:db.mentors.slice(0,3)};
const card=c=>`<a class="card rv" href="#/course/${c.slug}"><div class="im">${media(c)}</div><div class="b"><span class="tag">${c.cat} · ${c.months} months</span><h3>${c.name}</h3><div class="row"><span class="price">₹${c.price.toLocaleString('en-IN')}</span><span class="btn sm pur">Details</span></div></div></a>`;
const faq=l=>l.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('');
const mentorHtml=l=>`<div class="mentors">${l.map(m=>`<div class="mt">${m.img?`<img class="av" src="${m.img}" alt="">`:`<div class="av">${m.name[0]}</div>`}<b>${m.name}</b><div style="opacity:.8;font-size:14px">${m.info}</div></div>`).join('')}</div>`;
const syllabus=c=>c.syl&&c.syl.length?c.syl:['Foundations of '+c.name,'Core concepts and tools','Hands-on labs','Industry project (live)','Advanced topics','Capstone, interview prep & certification'];
const skills=c=>c.skills&&c.skills.length?c.skills:[c.name,'Problem solving','Project work','Git & teamwork','Interview skills','Industry tools'];
const outcomes=c=>c.outs&&c.outs.length?c.outs:['Build job-ready '+c.name+' projects','Earn an MSME-recognised, ISO-approved certificate','Get resume, mock interview and placement support'];

function nav(){
 $('#ticker').innerHTML=('<span>Learn</span>•<span>Grow</span>•<span>Industry Ready</span>•<span>Internship</span>•').repeat(12);
 let h='';for(const k in CATS){h+=`<b>${k}</b>`+pub().filter(c=>c.cat==k).map(c=>`<a href="#/course/${c.slug}">${c.name}</a>`).join('')}
 $('#ddm').innerHTML=h; const u=user();
 $('#auth').innerHTML=u?`<a class="btn sm" href="#/${u.role!='student'?'admin':'dash'}">${u.role!='student'?'Admin':'My learning'}</a> <button class="btn sm" onclick="logout()">Sign out</button>`:`<a class="btn sm" href="#/login">Sign in</a> <a class="btn sm pur" href="#/signup">Register</a>`;
}
function logout(){sessionStorage.removeItem('me');me=null;location.hash='#/';route()}

const pages={
home(){const w=db.workshop;return`
<div class="hero"><video autoplay muted loop playsinline poster="assets/workshop-image.png"><source src="assets/hero.mp4" type="video/mp4"></video>
<div><h1>Learn today. Build tomorrow.</h1><p>Basic-to-advanced training from working mentors, industry projects and placement support.</p>
<div class="cta"><a class="btn gold" href="#/courses">Explore programs</a><a class="btn" href="${w.link}" target="_blank">Book a free session</a></div></div>
<div class="pop" id="pop"><span class="x material-symbols-rounded" onclick="this.parentNode.remove()">close</span><b>${w.title}</b><small>${w.date} · ${w.joined} students joined</small><a class="btn sm gold" href="${w.link}" target="_blank">Register on Google Form</a></div></div>
<section><h2 class="rv">Training that ends in a job</h2><p class="sub rv">Everything you need from first lesson to first offer.</p><div class="feat">
${[['school','Experienced mentors','Basic to advanced training by people who work in the industry.'],['construction','Industrial projects','Build projects that mirror real company work.'],['work','Placement guidance','Resume, mock interviews and openings with hiring partners.'],['verified','Recognised certificates','MSME recognised, issued by an ISO-approved organisation.']].map(f=>`<div class="rv"><span class="material-symbols-rounded">${f[0]}</span><h3>${f[1]}</h3><p>${f[2]}</p></div>`).join('')}</div></section>
<section style="background:#f5ebdc"><h2 class="rv">Popular programs</h2><p class="sub rv">Pick a program to see its syllabus, skills and outcomes.</p><div class="grid">${pub().slice(0,8).map(card).join('')}</div><p style="margin-top:26px"><a class="btn pur" href="#/courses">View all ${pub().length} programs</a></p></section>
<section class="dark"><h2 class="rv">Why choose Yugva</h2><p class="sub rv">Internship, placements and certification in one program.</p><div class="feat">${['Internship with live projects','Placement support','MSME and ISO certification'].map(t=>`<div class="rv"><h3 style="color:var(--g)">${t}</h3></div>`).join('')}</div>
<h2 style="margin:50px 0 10px" class="rv">Learn from our mentors</h2>${mentorHtml(db.mentors)}</section>
<section><h2 class="rv">Where our students work</h2><div class="logos rv"><span>TCS</span><span>Infosys</span><span>Accenture</span><span>Wipro</span><span>Cognizant</span></div></section>
<section style="background:#f5ebdc"><h2 class="rv">Student reviews</h2><br><div class="revs"><div class="rt">${[...REVIEWS,...REVIEWS].map(r=>`<div class="rv2"><div class="stars">★★★★★</div><p>${r[2]}</p><b>${r[0]}</b><div class="tag">${r[1]}</div></div>`).join('')}</div></div></section>
<section><h2 class="rv">Questions, answered</h2><br><div class="rv">${faq(FAQ)}</div></section>`},

courses(){return`<section><h2>All programs</h2><p class="sub">Filter by category.</p><div class="chips">${['All',...Object.keys(CATS)].map(k=>`<button class="chip ${k=='All'?'on':''}" onclick="filt(this,'${k}')">${k}</button>`).join('')}</div><div class="grid" id="cg">${pub().map(card).join('')}</div></section>`},

course(s){const c=course(s),uu=user();if(!c||(c.status!='published'&&!(uu&&uu.role!='student')))return'<section><h2>Program not found</h2></section>';const u=user(),en=u&&u.enr&&u.enr[s];return`
<div class="ch"><div><span class="tag" style="color:var(--g)">${c.cat} · ${c.months} months · ${enrolled(s)} enrolled</span><h1>${c.name}</h1><p style="margin:14px 0 22px">${c.desc||'Live and recorded classes, an industry project and placement support.'}</p>
<button class="btn gold" onclick="enroll('${s}')">${en?'Go to my learning':'Enroll for ₹'+c.price.toLocaleString('en-IN')}</button></div><div class="im">${c.img?`<img src="${c.img}" alt="">`:`<span class="material-symbols-rounded" style="font-size:120px;color:var(--g)">${c.icon}</span>`}</div></div>
<section class="two"><div class="rv"><h2>Syllabus</h2><br><div class="syl">${syllabus(c).map((m,i)=>`<div>Module ${i+1}: ${m}</div>`).join('')}</div></div>
<div class="rv"><h2>What you'll learn</h2><ul>${outcomes(c).map(o=>`<li>${o}</li>`).join('')}</ul><br><h2>Skills you gain</h2><br><div class="skills">${skills(c).map(k=>`<span>${k}</span>`).join('')}</div></div></section>
<section class="dark"><h2 class="rv">Your mentors</h2><br>${mentorHtml(mentorsFor(s))}</section>
<section><h2 class="rv">Student reviews</h2><br><div class="grid">${REVIEWS.slice(0,3).map(r=>`<div class="rv2 rv" style="width:auto"><div class="stars">★★★★★</div><p>${r[2]}</p><b>${r[0]}</b></div>`).join('')}</div>
<h2 style="margin:40px 0 14px" class="rv">Program FAQ</h2><div class="rv">${faq([['How long is the program?',c.months+' months, with weekend live sessions.'],['Do I need prior experience?','No. We start from the basics.'],...FAQ.slice(0,2)])}</div></section>`},

login(){return`<form class="box" onsubmit="return auth(event,'in')"><h2>Sign in</h2><input name="email" type="email" placeholder="Email" required><input name="pw" type="password" placeholder="Password" required><button class="btn pur">Sign in</button><small>Test student: test@yugva.in / test123<br>Test admin: admin@yugva.in / admin123</small></form>`},
signup(){return`<form class="box" onsubmit="return auth(event,'up')"><h2>Create account</h2><input name="name" placeholder="Full name" required><input name="email" type="email" placeholder="Email" required><input name="pw" type="password" placeholder="Password (min 6)" minlength="6" required><button class="btn pur">Register</button></form>`},
verify(){return`<div class="box"><h2>Verify certificate</h2><input id="cid" placeholder="Certificate ID e.g. YUG-2026-0001"><button class="btn pur" onclick="toast(/^YUG-\\d{4}-\\d{4}$/.test($('#cid').value)?'Valid format – connect to your records to confirm':'Enter an ID like YUG-2026-0001')">Verify</button></div>`},
contact(){return`<form class="box" onsubmit="event.preventDefault();toast('Thanks – we will call you back');this.reset()"><h2>Contact us</h2><input placeholder="Name" required><input placeholder="Phone" required><button class="btn pur">Request call back</button></form>`},
blog(){return`<section><h2>Blog</h2><p class="sub">Posts coming soon.</p></section>`},

dash(){const u=user();if(!u||u.role!='student')return pages.login();const ids=Object.keys(u.enr),ach=u.ach||[];return`<div class="dash"><div class="side"><b>Hi, ${u.name}</b></div><div><h2>My learning</h2>
<div class="stat"><div><b>🔥 ${u.streak||0}</b>day streak</div><div><b>${ids.length}</b>programs</div><div><b>${ach.length}</b>achievements</div></div>
<div>${ach.map(a=>`<span class="badge"><span class="material-symbols-rounded">emoji_events</span>${a}</span>`).join('')||'<p class="sub">Watch your first video to earn a badge.</p>'}</div><br>
${ids.map(s=>{const c=course(s),e=u.enr[s],vs=[...Array(vn(c))].map((_,i)=>i),wait=e.last?Math.max(0,H6-(Date.now()-e.last)):0;
return`<h3>${c?c.name:s}</h3><p class="sub">${e.w}/${vn(c)} videos${wait?' · next unlocks in '+Math.ceil(wait/36e5)+'h':''} ${wait?`<button class="btn sm" onclick="skip('${s}')">Skip wait (demo)</button>`:''}</p>`+vs.map(i=>{const ok=i==e.w&&!wait,done=i<e.w;return`<div class="vid ${ok||done?'':'lock'}"><span class="material-symbols-rounded">${done?'check_circle':ok?'play_circle':'lock'}</span>${vt(c,i)}<span style="margin-left:auto">${ok?`<button class="btn sm pur" onclick="watch('${s}')">Watch</button>`:''}</span></div>`}).join('')}).join('')||'<p>You have not enrolled yet. <a href="#/courses" class="tag">Browse programs</a></p>'}</div></div>`},
};
function filt(b,k){document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x==b));$('#cg').innerHTML=pub().filter(c=>k=='All'||c.cat==k).map(card).join('');obs()}
function auth(e,m){e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
 if(m=='up'){if(db.users.some(u=>u.email==f.email))return toast('Email already registered'),false;db.users.push({name:f.name,email:f.email,pw:f.pw,role:'student',enr:{},streak:0,last:'',ach:[]});save()}
 const u=db.users.find(x=>x.email==f.email&&x.pw==f.pw);if(!u)return toast('Wrong email or password'),false;if(u.off)return toast('Account deactivated'),false;
 me=u.email;sessionStorage.setItem('me',JSON.stringify(me));location.hash=u.role!='student'?'#/admin':'#/dash';return false}
function enroll(s){const u=user();if(!u)return toast('Sign in to enroll'),location.hash='#/login';if(u.role!='student')return toast('Admins cannot enroll');
 if(!u.enr[s]){u.enr[s]={w:0,last:0};u.ach=u.ach||[];u.ach.push('Enrolled in '+course(s).name);save();toast('Enrolled!')}location.hash='#/dash'}
function watch(s){const u=user(),e=u.enr[s],d=new Date().toDateString();const cv=course(s).videos;if(cv&&cv[e.w]&&cv[e.w].u)window.open(cv[e.w].u,'_blank');e.w++;e.last=Date.now();
 if(u.last!=d){u.streak=(u.last==new Date(Date.now()-864e5).toDateString()?u.streak:0)+1;u.last=d}
 const add=t=>{if(!u.ach.includes(t))u.ach.push(t)};add('First lesson done');if(e.w==4)add('Halfway there');if(e.w==vn(course(s)))add('Completed '+course(s).name);if(u.streak>=3)add('3-day streak');
 save();route()}
const skip=s=>{user().enr[s].last-=H6;save();route()};
const delU=e=>{db.users=db.users.filter(u=>u.email!=e);save();route()};
const delC=s=>{db.courses=db.courses.filter(c=>c.slug!=s);save();nav();route()};
function setW(e){e.preventDefault();const f=Object.fromEntries(new FormData(e.target));db.workshop={...f,joined:+f.joined};save();toast('Workshop updated');return false}
function obs(){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});document.querySelectorAll('.rv:not(.in)').forEach(e=>io.observe(e))}
function route(){const [,p,a]=location.hash.slice(1).split('/');const f=pages[p||'home']||pages.home;A.innerHTML=f(a);nav();window.scrollTo(0,0);document.getElementById('menu').classList.remove('open');obs()}

const pub=()=>db.courses.filter(c=>c.status=='published'),vn=c=>c&&c.videos&&c.videos.length||8,vt=(c,i)=>c&&c.videos&&c.videos[i]?c.videos[i].t:'Lesson '+(i+1);
const PERM={superadmin:['students','courses','mentors','workshop','staff'],academic:['students','courses','mentors','workshop'],instructor:['courses','mentors'],counsellor:['students'],finance:['students']};
let ctab='',cedit='',q='',pend={};const can=(u,t)=>(PERM[u.role]||[]).includes(t),fd=e=>{e.preventDefault();return Object.fromEntries(new FormData(e.target))},ln=t=>(t||'').split('\n').map(x=>x.trim()).filter(Boolean),rer=()=>{A.innerHTML=pages.admin();obs()};
const rd=(f,k)=>{if(!f)return;const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const z=Math.min(1,700/i.width),c=document.createElement('canvas');c.width=i.width*z;c.height=i.height*z;c.getContext('2d').drawImage(i,0,0,c.width,c.height);pend[k]=c.toDataURL('image/jpeg',.8);toast('Image ready – press Save')};i.src=r.result};r.readAsDataURL(f)};
const sel=(n,o,v)=>`<select name="${n}">${o.map(x=>`<option ${x==v?'selected':''}>${x}</option>`).join('')}</select>`;
pages.admin=function(){const u=user();if(!u||u.role=='student')return pages.login();const tabs=Object.keys({students:1,courses:1,mentors:1,workshop:1,staff:1}).filter(t=>can(u,t)),tab=tabs.includes(ctab)?ctab:tabs[0],w=db.workshop;
const T={
students:()=>{const st=db.users.filter(x=>x.role=='student'&&(x.name+x.email).toLowerCase().includes(q.toLowerCase()));return`<form class="stat" onsubmit="return addS(event)"><input name="name" placeholder="Name" required><input name="email" placeholder="Email" required><input name="pw" placeholder="Password" minlength="6" required><button class="btn pur">Add student</button></form><input placeholder="Search name or email, press Enter" value="${q}" onchange="q=this.value;rer()"><br><br><table><tr><th>Name</th><th>Email</th><th>Programs</th><th>Status</th><th></th></tr>${st.map(x=>`<tr><td>${x.name}</td><td>${x.email}</td><td>${Object.keys(x.enr).join(', ')||'–'}</td><td>${x.off?'Inactive':'Active'}</td><td><button class="btn sm" onclick="togS('${x.email}')">${x.off?'Activate':'Deactivate'}</button> <button class="btn sm" onclick="delU('${x.email}')">Remove</button></td></tr>`).join('')}</table>`},
courses:()=>{if(cedit){const c=course(cedit);return`<form onsubmit="return saveC(event)" class="box" style="max-width:680px;margin:0"><h3>Edit ${c.name}</h3><input name="name" value="${c.name}">${sel('cat',Object.keys(CATS),c.cat)}<input name="price" type="number" value="${c.price}"><input name="months" type="number" value="${c.months}">${sel('status',['draft','published','archived'],c.status)}<label>Course image <input type="file" accept="image/*" onchange="rd(this.files[0],'c')"></label><label>Description<textarea name="desc">${c.desc||''}</textarea></label><label>Syllabus modules (one per line)<textarea name="syl">${(c.syl||[]).join('\n')}</textarea></label><label>Skills (one per line)<textarea name="skills">${(c.skills||[]).join('\n')}</textarea></label><label>Outcomes (one per line)<textarea name="outs">${(c.outs||[]).join('\n')}</textarea></label><label>Videos (Title | URL, one per line)<textarea name="videos">${(c.videos||[]).map(v=>v.t+' | '+v.u).join('\n')}</textarea></label><b>Mentors</b>${db.mentors.map(m=>`<label><input type="checkbox" name="m" value="${m.id}" style="width:auto" ${(c.mentors||[]).includes(m.id)?'checked':''}> ${m.name}</label>`).join('')}<button class="btn pur">Save course</button><button type="button" class="btn" onclick="cedit='';rer()">Back</button></form>`}
return`<form class="stat" onsubmit="return addC(event)"><input name="name" placeholder="New program name" required><button class="btn pur">Add program</button></form><table><tr><th>Program</th><th>Status</th><th>Price</th><th></th></tr>${db.courses.map(c=>`<tr><td>${c.name}</td><td>${c.status}</td><td>₹${c.price}</td><td><button class="btn sm" onclick="cedit='${c.slug}';pend={};rer()">Edit</button> <button class="btn sm" onclick="delC('${c.slug}')">Delete</button></td></tr>`).join('')}</table>`},
mentors:()=>`<form class="stat" onsubmit="return addM(event)"><input name="name" placeholder="Mentor name" required><input name="info" placeholder="Title / experience"><button class="btn pur">Add mentor</button></form>${db.mentors.map(m=>`<form class="stat" onsubmit="return saveM(event,'${m.id}')">${m.img?`<img class="av" src="${m.img}" alt="" style="margin:0">`:''}<input name="name" value="${m.name}"><input name="info" value="${m.info}"><input type="file" accept="image/*" onchange="rd(this.files[0],'${m.id}')"><button class="btn sm pur">Save</button><button type="button" class="btn sm" onclick="delM('${m.id}')">Delete</button></form>`).join('')}`,
workshop:()=>`<form onsubmit="return setW(event)" class="box" style="margin:0"><h3>This week's workshop</h3><input name="title" value="${w.title}"><input name="date" value="${w.date}"><input name="link" value="${w.link}" placeholder="Google Form link"><input name="joined" type="number" value="${w.joined}"><button class="btn pur">Save workshop</button></form>`,
staff:()=>`<form class="stat" onsubmit="return addF(event)"><input name="name" placeholder="Name" required><input name="email" placeholder="Email" required><input name="pw" placeholder="Password" minlength="6" required>${sel('role',Object.keys(PERM),'academic')}<button class="btn pur">Add staff</button></form><table><tr><th>Name</th><th>Email</th><th>Role</th></tr>${db.users.filter(x=>x.role!='student').map(x=>`<tr><td>${x.name}</td><td>${x.email}</td><td><select ${x.email==me?'disabled':''} onchange="setR('${x.email}',this.value)">${Object.keys(PERM).map(r=>`<option ${r==x.role?'selected':''}>${r}</option>`).join('')}</select></td></tr>`).join('')}</table>`};
return`<div class="dash"><div class="side">${tabs.map(t=>`<button class="${t==tab?'on':''}" onclick="ctab='${t}';cedit='';rer()">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div><div><h2>${u.role} dashboard</h2>${T[tab]()}</div></div>`};
const ok=(r)=>{save();nav();rer();return false};
function addS(e){const f=fd(e);if(!/^\S+@\S+\.\S+$/.test(f.email))return toast('Enter a valid email'),false;if(db.users.some(u=>u.email==f.email))return toast('Email already used'),false;db.users.push({...f,role:'student',enr:{},streak:0,last:'',ach:[]});return ok()}
const togS=e=>{const u=db.users.find(x=>x.email==e);u.off=!u.off;ok()};
function addC(e){const f=fd(e);db.courses.push({slug:f.name.toLowerCase().replace(/\W+/g,'-'),name:f.name,cat:'Tech',price:9999,icon:'school',months:4,img:'',status:'draft',desc:'',syl:[],skills:[],outs:[],mentors:[],videos:[]});return ok()}
function saveC(e){e.preventDefault();const F=new FormData(e.target),f=Object.fromEntries(F),c=course(cedit);Object.assign(c,{name:f.name,cat:f.cat,price:+f.price,months:+f.months,status:f.status,desc:f.desc,syl:ln(f.syl),skills:ln(f.skills),outs:ln(f.outs),mentors:F.getAll('m'),videos:ln(f.videos).map(l=>{const p=l.split('|');return{t:p[0].trim(),u:(p[1]||'').trim()}})});if(pend.c)c.img=pend.c;pend={};toast('Course saved');return ok()}
function addM(e){const f=fd(e);db.mentors.push({id:'m'+Date.now(),name:f.name,info:f.info,img:''});return ok()}
function saveM(e,id){const f=fd(e),m=db.mentors.find(x=>x.id==id);m.name=f.name;m.info=f.info;if(pend[id])m.img=pend[id];toast('Mentor saved');return ok()}
const delM=id=>{db.mentors=db.mentors.filter(m=>m.id!=id);ok()};
function addF(e){const f=fd(e);if(db.users.some(u=>u.email==f.email))return toast('Email already used'),false;db.users.push({...f,enr:{}});return ok()}
const setR=(e,r)=>{if(e==me)return;db.users.find(u=>u.email==e).role=r;ok()};
addEventListener('hashchange',route);route();
