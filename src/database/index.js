const sqlite3 = require('sqlite3').verbose()
const config = require("../config/config.json")

class Connection {
    constructor(config) {
        let dbfile = process.env.DB_FILE_PATH || config.db_file_path;
        this.db = new sqlite3.Database(dbfile, function (err) {
            if (err) {
                console.log(err, config.storage)
            }
        });
    }
}


module.exports = new Connection(config).db;


