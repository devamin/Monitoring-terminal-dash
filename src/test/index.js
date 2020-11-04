process.env.DB_FILE_PATH = 'storage/test.db';
const migrate = require('../migration')
const server = require('./server')
const mockWebsites = require('../config/config.json').test
const websiteRepo = require("../repositories/websiteRepo")
const Website = require('../model/website');
const manager = require('../stateManagement')
const fs = require('fs')

function clean() {
    try {
        fs.unlinkSync(process.env.DB_FILE_PATH)
    } catch (err) {
        console.error(err)
    }
}

process.on('exit', clean);
process.on('SIGINT', clean);

async function main() {
    await migrate();
    await Promise.all(mockWebsites.map(website => websiteRepo.insert(new Website(website.url, website.interval))));
    let localServers = [
        new Website("http://localhost:3000", 2000),
        new Website("http://localhost:3200", 2000),
        new Website("http://localhost:3400", 2000),
        new Website("http://localhost:3500", 2000),
    ];

    await Promise.all(localServers.map(s => websiteRepo.insert(s)));
    server(3000);
    server(3200);
    server(3400);
    server(3500);

    manager.start();

}
main();

