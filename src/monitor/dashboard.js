var blessed = require('blessed')
  , contrib = require('blessed-contrib');
const Website = require('../model/website')

class Dashboard {

  constructor() {

  }

  monitor(websites) {
    this.websites = websites;
    this.assignRelatedDataToWebsiteModel();
    this.y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    this.screen = blessed.screen();
    this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen });
    this.setRespTimeChartLine();
    this.tables = [];
    this.currentTable = 0;
    this.setTable10MStats();
    this.setTable1HStats();
    this.setAlertTable();
    this.tables[this.currentTable].focus();
    this.events();
    this.render();
  }

  events() {
    this.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
      return process.exit(0);
    });
    this.screen.key(['tab'], (ch, key) => {
      this.currentTable = (this.currentTable === this.tables.length - 1) ? 0 : this.currentTable + 1;
      this.tables[this.currentTable].focus();
    });
    this.screen.on('resize', () => {
      for (let table of this.tables)
        table.emit("attach");

      this.respTimeLine.emit('attach');

    });
  }

  render() {
    this.screen.render()
  }

  randomColor() {
    return [Math.random() * 255, Math.random() * 255, Math.random() * 255]
  }
  assignColorToWebsites() {
    let colors = ['red', 'yellow', 'green', "blue", "magenta", "cyan"]
    for (let website of this.websites) {
      if (colors.length)
        website.color = colors.shift();
      else website.color = this.randomColor();
    }
  }

  assignRelatedDataToWebsiteModel() {
    this.assignColorToWebsites();
    for (let website of this.websites) {
      website.lineChartData = {
        title: website.name,
        style: { line: website.color },
        x: [],
        y: []
      }
    }
  }

  // Line Chart ========================
  setRespTimeChartLine() {
    this.xRespTime = []
    this.respTimeDatas = []
    this.respTimeLine = this.grid.set(6, 0, 6, 12, contrib.line,
      {
        showNthLabel: 5
        , maxY: Website.TIMEOUT_THRESHOLD
        , label: 'Response Time last 10 minutes'
        , showLegend: true
        , legend: { width: 20 }
      })
  }

  updateWebsiteLineData(website) {
    if (website.lineChartData.y.length >= 600000 / website.interval) {
      website.lineChartData.y.shift();
    } else {
      website.lineChartData.x.push(website.lineChartData.y.length);
    }
    website.lineChartData.y.push(website.currentMetrics.respTime)
  }

  refreshLinesCharts() {
    let data = []
    for (let website of this.websites) {
      data.push(website.lineChartData)
    }
    this.respTimeLine.setData(data);
    this.render()
  }

  // 10 Minutes  ========================
  setTable10MStats() {
    this.table10M = this.grid.set(0, 0, 3, 6, contrib.table,
      {
        keys: true
        , fg: 'green'
        , label: 'Last 10 Minutes Stats'
        , columnSpacing: 1
        , columnWidth: [24, 10, 10, 10]
      })

    this.tables.push(this.table10M);
  }

  updateTable10MStats() {
    let data = []

    for (let website of this.websites) {
      let row = [];
      row.push(website.name);
      row.push(parseFloat(website.last10MStats.availability).toFixed(2));
      row.push(parseFloat(website.last10MStats.avgRespTime).toFixed(2));
      row.push(website.last10MStats.maxRespTime);
      data.push(row);
    }

    this.table10M.setData({ headers: ['NAME', 'AVAILAB', 'AVG', 'MAX'], data: data })
  }


  // 1H Minutes  =================================
  setTable1HStats() {
    this.table1H = this.grid.set(0, 6, 3, 6, contrib.table,
      {
        keys: true
        , fg: 'green'
        , label: 'Last 1 Hours Stats'
        , columnSpacing: 1
        , columnWidth: [24, 10, 10, 10]
      })
    this.tables.push(this.table1H);
  }

  updateTable1HStats() {
    let data = []

    for (let website of this.websites) {
      let row = [];
      row.push(website.name);
      row.push(parseFloat(website.last1HStats.availability).toFixed(2));
      row.push(parseFloat(website.last1HStats.avgRespTime).toFixed(2));
      row.push(website.last1HStats.maxRespTime);
      data.push(row);
    }

    this.table1H.setData({ headers: ['NAME', 'AVAILAB', 'AVG', 'MAX'], data: data })
  }

  // Alerts  =================================

  setAlertTable() {
    this.alertTable = this.grid.set(3, 0, 3, 12, contrib.table,
      {
        keys: true
        , fg: 'green'
        , label: 'Alerts ⚠️'
        , columnSpacing: 1
        , columnWidth: [10, 20, 20, 40]
      })
    this.tables.push(this.alertTable);
  }

  updateAlertsTable(alerts) {
    let data = []

    for (let i = alerts.length - 1; i >= 0; i--) {
      let row = []
      row.push(alerts[i].time.toISOString().match(/(\d{2}:){2}\d{2}/)[0])
      row.push(alerts[i].name)
      row.push(parseFloat(alerts[i].availability).toFixed(2))
      row.push(alerts[i].message)
      data.push(row)
    }

    this.alertTable.setData({ headers: ['Time', 'Name', 'Availability', 'Message'], data: data })
  }

  stop() {
    this.screen.destroy();
  }
}

module.exports = new Dashboard();

