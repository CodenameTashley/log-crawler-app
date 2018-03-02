var app = angular.module('crawlerApp', []);
app.factory('appService', function ($http, $httpParamSerializer) {

    var BASEURL = "http://localhost:9500/";

    return {
        getSlaves: getSlaves,
        getLogsByDateAndSlave: getLogsByDateAndSlave
    }

    function getSlaves() {
        var url = BASEURL + 'slaves';
        return $http.get(url);
    }

    function getLogsByDateAndSlave(query) {
        var url = BASEURL + 'logByDateAndSlave',
            qs = $httpParamSerializer(query);
        return $http.get(url+ '?' + qs);
    }

});