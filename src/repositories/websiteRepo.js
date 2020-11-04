const dao = require('../dao');
const Website = require('../model/website')

class WebsiteRepo {

    constructor(dao) {
        this.dao = dao;
    }


    async insert(website) {
        let sql = `
        INSERT INTO website (url,name,interval)
        VALUES (?,?,?)`;
        let data = [website.url, website.name, website.interval];

        return await this.dao.run(sql, data).then(id => {
            website.id = id;
        });
    }

    async all() {
        let sql = `SELECT * FROM website`;
        let rows = await this.dao.all(sql)
        let websites = [];
        for (let r of rows) {
            websites.push(new Website(r.url, r.interval, r.id));
        }
        return websites;
    }

    findOne(id) {
        let sql = `SELECT * FROM website WHERE id = ?`;
        return this.dao.get(sql, [id]);
    }


    deleteAll(ids) {
        let sql = `DELETE FROM website WHERE id IN (${ids.join(',')})`;
        return this.dao.run(sql)
    }

}

module.exports = new WebsiteRepo(dao);