
app.controller('appCtrl', function ($scope, appService) {

    var vm = this;

    vm.date = new Date();
    /* API CALLS */
    loadSlaves();

    /* FUNCTIONS */
    function loadSlaves() {
        appService.getSlaves().then(function (response) {
            vm.slaves = response.data;
            if (vm.slaves.length > 0)
            vm.currentSlave = vm.slaves[0];
        })
    }
});