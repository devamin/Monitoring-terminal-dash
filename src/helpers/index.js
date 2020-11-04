

module.exports.isValidUrl = function (url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}