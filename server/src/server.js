const{openDb}=require('./db'),{createApp}=require('./app'),dev=(process.env.NODE_ENV||'development')!=='production';
const db=openDb(process.env.DB_PATH||'./data/yugva.db'),port=+process.env.PORT||3000;
createApp(db,{dev,secure:!dev,sessionMinutes:+process.env.SESSION_MINUTES||30}).listen(port,()=>console.log('Yugva running on http://localhost:'+port));
process.on('unhandledRejection',e=>console.error('unhandled',e));
