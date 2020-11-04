const metricsRepo = require("../repositories/metricsRepo");


class Website {

    constructor(url, interval, id) {
        this.url = url;
        this.id = id;
        this.interval = interval;
        this.name = (new URL(url)).host
        this.currentMetrics = {
            availability: false,
            respTime: 0.0,
            status: 0,
        };
        this.watcher = undefined;
        this.last10MStats;
        this.last1HStats;
    }

    setState(availability, respTime, status) {
        this.currentMetrics = {
            availability: availability,
            respTime: respTime,
            status: status
        };

    }


    async updateLast10MStats() {
        let rs = await metricsRepo.findLastStatsByTimestamp(this, 60000)
        this.last10MStats = {
            availability: (typeof rs.availability == 'number' && !isNaN(rs.availability)) ? rs.availability : 0,
            avgRespTime: (typeof rs.avgRespTime == 'number' && !isNaN(rs.avgRespTime)) ? rs.avgRespTime : 0,
            maxRespTime: (typeof rs.maxRespTime == 'number' && !isNaN(rs.maxRespTime)) ? rs.maxRespTime : 0,
        }
    }

    async updateLast1HStats() {
        let rs = await metricsRepo.findLastStatsByTimestamp(this, 3600000);
        this.last1HStats = {
            availability: (typeof rs.availability == 'number' && !isNaN(rs.availability)) ? rs.availability : 0,
            avgRespTime: (typeof rs.avgRespTime == 'number' && !isNaN(rs.avgRespTime)) ? rs.avgRespTime : 0,
            maxRespTime: (typeof rs.maxRespTime == 'number' && !isNaN(rs.maxRespTime)) ? rs.maxRespTime : 0,
        }
    }

    async availabilityPast2Min() {
        return await metricsRepo.getAvailabilityForPastXTime(this, 120000);
    }

    state() {
        return `${this.name} | ${this.currentMetrics.availability} | respTime : ${this.currentMetrics.respTime} | status : ${this.currentMetrics.status} | maxResp : ${this.totalMetrics.maxResTime}`
    }

    toString() {
        return `id : ${this.id} | name : ${this.name} | url : ${this.url} | interval : ${this.interval}`
    }


}

module.exports = Website
module.exports.TIMEOUT_THRESHOLD = 3000;