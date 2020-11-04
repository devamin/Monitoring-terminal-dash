const axios = require('axios')

const instance = axios.create();
instance.interceptors.request.use(function (config) {
    config.metadata = { startTime: new Date() }
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    response.config.metadata.endTime = new Date()
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime
    return response;
}, function (error) {
    error.config.metadata.endTime = new Date();
    error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
});

module.exports = instance