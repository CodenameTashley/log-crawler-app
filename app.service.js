var app = angular.module('crawlerApp', []);
app.factory('appService', function($http) {

    var BASEURL = "http://localhost:9500/";
    
    return {
        getSlaves: getSlaves
    }

    function getSlaves() {
        var url = BASEURL + 'slaves';
        return $http.get(url);
    }

});