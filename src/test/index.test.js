process.env.DB_FILE_PATH = 'storage/test.db';
const migrate = require('../migration')
const server = require('./server')
const mockWebsites = require('../config/config.json').test
const websiteRepo = require("../repositories/websiteRepo")
const Website = require('../model/website');
const manager = require('../stateManagement')
const fs = require('fs')
const assert = require('chai').assert;


function clean() {
    try {
        fs.unlinkSync(process.env.DB_FILE_PATH)
    } catch (err) {
        console.error(err)
    }
}

process.on('exit', clean);
process.on('SIGINT', clean);

describe('End To End Test:', function () {
    it('check alerts', async function () {
        await migrate();
        await Promise.all(mockWebsites.map(website => websiteRepo.insert(new Website(website.url, website.interval))));
        let localServers = [
            new Website("http://localhost:3000", 1000),
            new Website("http://localhost:3200", 1000),
            new Website("http://localhost:3400", 1000),
            new Website("http://localhost:3500", 1000),
        ];

        await Promise.all(localServers.map(s => websiteRepo.insert(s)));
        let s1 = server(3000);
        let s2 = server(3200);
        let s3 = server(3400);
        let s4 = server(3500);

        manager.start();
        setTimeout(() => {

            manager.stop()
            clearInterval(s1)
            clearInterval(s2)
            clearInterval(s3)
            clearInterval(s4)
            assert.isAbove(manager.alert.alerts.length, 0)
        }, 20000)
    });
});

