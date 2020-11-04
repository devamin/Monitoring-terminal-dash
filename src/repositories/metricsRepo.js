const dao = require('../dao');

class WebsiteRepo {

    constructor(dao) {
        this.dao = dao;
    }


    insert(website) {
        let sql = `
        INSERT INTO metrics (availability,respTime,status,timestamp,website_id)
        VALUES (?,?,?,?,?)`;
        let data = [website.currentMetrics.availability, website.currentMetrics.respTime, website.currentMetrics.status, new Date(), website.id];
        return this.dao.run(sql, data);
    }

    async findLastStatsByTimestamp(website, time) {
        let params = [website.id, new Date() - time]
        let sql = `
            SELECT count(*) as counts,MAX(respTime) as maxRespTime,AVG(respTime) as avgRespTime from metrics where website_id = ? and timestamp >= ? and availability=1`
        let data = await this.dao.get(sql, params)
        let sqlAvail = `
            SELECT count(*) as counts from metrics where website_id = ? and timestamp >= ?
        `
        let rs = await this.dao.get(sqlAvail, params);
        return {
            maxRespTime: data.maxRespTime,
            avgRespTime: data.avgRespTime,
            availability: data.counts / rs.counts
        }
    }


    async getAvailabilityForPastXTime(website, time) {
        let sql = `
        select count(*) as counts, sum(availability=1) as availables from metrics where website_id = ? and timestamp >= ?;
        `
        let rs = await this.dao.get(sql, [website.id, new Date() - time])
        return rs.availables / rs.counts
    }

}

module.exports = new WebsiteRepo(dao);