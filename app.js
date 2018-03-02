app.controller('appCtrl', function ($scope, appService) {

    var vm = this;

    vm.date = new Date();
    vm.currentSlave = {};

    vm.searchLogByDate = searchLogByDate;
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

    function searchLogByDate() {

        var query = {
            date: formatDate(),
            slave: vm.currentSlave
        }
        appService.getLogsByDateAndSlave(query).then(function (response) {
            if (response.status === 200) {
                if (typeof response.data === "string") {
                    vm.log = undefined;
                    vm.errorMessage = response.data;
                } else {
                    vm.errorMessage = undefined;
                    vm.log = response.data.map(function (log) {
                        return formatLog(log);
                    });
                }
            } else {
                vm.log = "No log available";
            }
        });
    }

    function formatDate() {
        var d = new Date(vm.date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    function formatLog(log) {
        var objLog = {};
        objLog.dateAndTime = log.substring(0, log.indexOf(" INFO"));

        var details = log.substring(log.indexOf("DataNode.clienttrace: "), log.length - 1);
        var arrDetails = details.split(", ");

        objLog.src = arrDetails[0].substring(arrDetails[0].indexOf("src: ") + 5, arrDetails[0].length);
        objLog.dest = arrDetails[1].substring(arrDetails[1].indexOf("dest: ") + 6, arrDetails[1].length);
        objLog.size = formatBytes(parseInt(arrDetails[2].substring(arrDetails[2].indexOf("bytes: ") + 7, arrDetails[2].length)));
        objLog.op = arrDetails[3].substring(arrDetails[3].indexOf("op: ") + 4, arrDetails[3].length);
        objLog.cliID = arrDetails[4].substring(arrDetails[4].indexOf("cliID: ") + 7, arrDetails[4].length);
        objLog.offset = arrDetails[5].substring(arrDetails[5].indexOf("offset: ") + 8, arrDetails[5].length);
        objLog.srvID = arrDetails[6].substring(arrDetails[6].indexOf("srvID: ") + 7, arrDetails[6].length);
        objLog.blockID = arrDetails[7].substring(arrDetails[7].indexOf("blockid: ") + 9, arrDetails[7].length);
        objLog.duration = arrDetails[8].substring(arrDetails[8].indexOf("duration: ") + 10, arrDetails[8].length);

        console.log(objLog);
        return objLog;
    }

    function msToMinAndSec(ms) {
        var sec = Math.floor(ms / 1000);
        ms = ms - (sec * 1000);

        var min = Math.floor(sec / 60);
        sec = sec - (min * 60);

        var hr = Math.floor(min / 60);
        min = min - (hr * 60);

        return hr + " hr, " + min + " min, " + sec + " sec, " + ms + " ms";
    }

    function formatBytes(bytes) {
        if (bytes < 1024) {
            return bytes + " Bytes";
        } else {
            if (bytes < 1048576) {
                return (bytes / 1024).toFixed(3) + " KB";
            } else {
                if (bytes < 1073741824) { 
                    return (bytes / 1048576).toFixed(3) + " MB"; 
                } else { 
                    return (bytes / 1073741824).toFixed(3) + " GB"; 
                }
            }
        }
    };

});