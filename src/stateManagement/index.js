const websiteRepo = require('../repositories/websiteRepo')
const dashboard = require('../monitor/dashboard')
const Website = require("../model/website")
const metricsRepo = require("../repositories/metricsRepo")
const network = require("../network")
const alert = require("../alert")
class Manager {

    constructor() {
    }

    async start(syncBeats = 1000) {
        this.websites = await websiteRepo.all();
        this.syncBeats = syncBeats;
        this.alert = alert;
        this.keepAnEyeOnWebsites();
        this.update10MLastStats();
        this.update1HLastStats();
        this.alertWatcher();
        dashboard.monitor(this.websites);

    }

    update10MLastStats() {
        let update = async () => {

            await Promise.all(this.websites.map(website => website.updateLast10MStats()))
                .then(() => dashboard.updateTable10MStats())

        }
        update();
        setInterval(update, 10000)
    }

    update1HLastStats() {
        let update = async () => {
            await Promise.all(this.websites.map(website => website.updateLast1HStats()))
                .then(() => dashboard.updateTable1HStats())
        }
        update();
        setInterval(update, 60000)
    }

    keepAnEyeOnWebsites() {
        for (let website of this.websites) {
            let interval = setInterval(async function () {
                try {
                    let res = await network.get(website);
                    website.setState(res.status >= 200 && res.status < 400, res.duration, res.status);
                    metricsRepo.insert(website);
                    dashboard.updateWebsiteLineData(website);
                    dashboard.refreshLinesCharts()
                } catch (err) {
                    website.setState(false, Website.TIMEOUT_THRESHOLD, 0);
                    metricsRepo.insert(website);
                }
            }, website.interval)
            website.watcher = interval;
        }
    }

    alertWatcher() {
        let update = async () => {
            let availabilities = await Promise.all(this.websites.map((website) => website.availabilityPast2Min()));
            for (let i = 0; i < this.websites.length; i++) {
                let website = this.websites[i];
                let availability = availabilities[i];
                if (availability < 0.80) {
                    if (!website.isDown) {
                        website.isDown = true;
                        this.alert.addAlert({
                            time: new Date(),
                            name: website.name,
                            message: "website is down",
                            availability: availability
                        });
                    }
                } else {
                    if (website.isDown) {
                        website.isDown = false;
                        this.alert.addAlert({
                            time: new Date(),
                            name: website.name,
                            message: "website recovered",
                            availability: availability
                        });
                    }
                }
            }
            dashboard.updateAlertsTable(this.alert.alerts)
        }
        update();
        setInterval(update, 10000)
    }
}

module.exports = new Manager();