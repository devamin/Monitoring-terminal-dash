

class Alert {

    constructor() {
        this.alerts = []
    }

    addAlert(alert) {
        this.alerts.push(alert)
    }
}

module.exports = new Alert();