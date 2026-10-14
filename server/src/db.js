const Database=require('better-sqlite3'),fs=require('fs'),path=require('path');
function openDb(file){if(file!==':memory:')fs.mkdirSync(path.dirname(file),{recursive:true});const db=new Database(file);db.pragma('journal_mode=WAL');db.pragma('foreign_keys=ON');migrate(db);return db}
function migrate(db){db.exec('CREATE TABLE IF NOT EXISTS schema_migrations(name TEXT PRIMARY KEY)');const dir=path.join(__dirname,'..','migrations');
 for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.sql')).sort()){if(db.prepare('SELECT 1 FROM schema_migrations WHERE name=?').get(f))continue;
  db.transaction(()=>{db.exec(fs.readFileSync(path.join(dir,f),'utf8'));db.prepare('INSERT INTO schema_migrations VALUES(?)').run(f)})();console.log('migrated',f)}}
module.exports={openDb};
