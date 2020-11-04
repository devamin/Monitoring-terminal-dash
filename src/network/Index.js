const axios = require('./instance')

module.exports.get = async function (website) {
    return await axios.get(website.url);
}