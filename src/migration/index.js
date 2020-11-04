const dao = require('../dao')


async function upWebsite() {
  const sql = `
    CREATE TABLE IF NOT EXISTS website (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT, 
      name TEXT,
      interval INTEGER)`
  return await dao.run(sql)
}

async function upMetrics() {
  const sql = `
      CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        availability Boolean,
        respTime FLOAT,
        status INTEGER,
        timestamp DATETIME,
        website_id INTEGER,
        CONSTRAINT metrics_fk_website FOREIGN KEY (website_id)
          REFERENCES website(id) ON UPDATE CASCADE ON DELETE CASCADE)`
  return await dao.run(sql)
}

if (require.main === module) {
  upWebsite()
  upMetrics()
}

module.exports = async function () {
  await upWebsite();
  await upMetrics();
}
