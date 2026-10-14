const c=require('crypto');
exports.hash=pw=>{const s=c.randomBytes(16);return s.toString('hex')+':'+c.scryptSync(pw,s,64).toString('hex')};
exports.verify=(pw,h)=>{try{const[s,k]=h.split(':');return c.timingSafeEqual(c.scryptSync(pw,Buffer.from(s,'hex'),64),Buffer.from(k,'hex'))}catch{return false}};
exports.token=()=>c.randomBytes(32).toString('hex');exports.th=t=>c.createHash('sha256').update(t).digest('hex');
