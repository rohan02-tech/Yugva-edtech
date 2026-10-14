// Single source of truth for roles. Add new permissions here as later stages add features.
const ROLES={superadmin:['*'],academic:['students:read','students:write','courses:read','courses:write','batches:read','batches:write'],instructor:['courses:read','batches:read'],counsellor:['students:read','students:write'],finance:['students:read','payments:read','payments:write']};
const AREAS={admin:['superadmin','academic','counsellor','finance'],instructor:['instructor'],student:['student']};
const has=(role,p)=>!!ROLES[role]&&(ROLES[role].includes('*')||ROLES[role].includes(p));
module.exports={ROLES,AREAS,has};
