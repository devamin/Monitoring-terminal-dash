const rlsync = require('readline-sync');
const helpers = require('../helpers')
const Website = require('../model/website')
const websiteRepo = require('../repositories/websiteRepo')
const manager = require('../stateManagement')



function mainMenu() {
    let choice = rlsync.question(`
################################################################
#                                                              #
#                                                              #
#                  DATADOG MONITORING TOOLS                    #
#                                                              #
#                                              made by @AmineBk#
################################################################



Menu : 
    1 - Add a website
    2 - Delete a website
    3 - Start
    4 - Quit
    
`);
    switch (parseInt(choice)) {
        case 1: addWebsite(); break;
        case 2: deleteWebsites(); break;
        case 3: start(); break;
    }
}

async function start() {
    manager.start();
}

async function deleteWebsites() {
    let websites = await websiteRepo.all();
    websites.forEach(website => console.log(website.toString()))
    console.log("delete websites :e.g 1 2 3")
    let rowsToDelete = rlsync.question("delete websites : ");
    rowsToDelete = rowsToDelete.split(" ")
        .map(rid => parseInt(rid))
        .filter(rid => !isNaN(rid));

    if (rowsToDelete.length === 0);

    websiteRepo.deleteAll(rowsToDelete).then(() => mainMenu());

}

function addWebsite() {
    console.clear();
    console.log(`Add a webiste :`);
    let url = rlsync.question("url : ");
    while (!helpers.isValidUrl(url)) {
        console.log(`Not valid Url again`);
        url = rlsync.question("url : ")
    }
    let interval = 0;

    while (true) {
        try {
            interval = parseInt(rlsync.question("interval : "))
            break;
        } catch (e) {
            console.log("Not valid Integer try again")
        }
    }
    let website = new Website(url, interval);
    websiteRepo.insert(website).then(_ => mainMenu());
}


module.exports = mainMenu;

