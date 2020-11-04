const network = require("../network")
const metricsRepo = require("../repositories/metricsRepo")
const Website = require("../model/website")

function beat(website) {
    network.get(website).then(res => {
        website.setState(res.status >= 200 && res.status < 400, res.duration, res.status)
        metricsRepo.insert(website);
        console.log('beat on ' + website.name)
    }).catch(err => {
        website.setState(false, Website.TIMEOUT_THRESHOLD, 0)
        webiste.availability = false;
        metricsRepo.insert(website);
    })
}

module.exports = function (website) {
    let interval = setInterval(function () {
        beat(website)
    }, website.interval)
    website.watcher = interval;
}