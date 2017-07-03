var sorting = "empty";
var nav = new DayPilot.Navigator("navigator");
nav.onTimeRangeSelected = function (args) {
    var day = args.day;
    //day.setHours(8,0,0)
    //var start = day.substring(0,10) + " 08:00:00";
    //var start = day;
    //var days = day.daysInMonth();
    dp.startDate = day;
    dp.days = 1
    //alert(day)
    dp.cornerHtml = cornerHtml();
    document.getElementById('navigator').style.display = "none";
    dp.update();
    loadEvents();
};
nav.init();


var dp = new DayPilot.Scheduler("dp");


dp.onBeforeCellRender = function (args) {
    args.cell.backColor = "#8fbcff";

    //args.cell.business = true;

    var d = new DayPilot.Date();
    d.addMinutes(-15);

    if (args.cell.start < d) {  // past
        args.cell.backColor = "#ffcccc";
        return;
    }

    if (args.cell.utilization() > 0) {
        args.cell.backColor = "#cccddc";
        return;
    }

    var color = "green";

    var slotId = args.cell.start.toString("HH:mm");

    var min = 5;
    var max = 15;
    //args.cell.html = "<div style='cursor: default; position: absolute; left: 0px; top:0px; right: 0px; bottom: 0px; padding-left: 3px; text-align: center; background-color: " + color + "; color:white;'>" + "</div>";
};

dp.allowEventOverlap = false;
cornerHtml = function () {
    return ('<div style = "font-size:20px; text-align:right; margin-right: 20px"><a href="#" id="date_ahref" onclick="showCalendar();return false;">' + DayPilot.Date(dp.startDate).toString("dd.MM.yyyy") + "</a></div>");
}
dp.cornerHtml = cornerHtml();
//dp.theme = "scheduler_white";
dp.rowHeaderColumns = [
    {title: '<a href="#" onclick="sortNow(&quot;rating&quot;);return false;">№</a>', width: 25},
    {title: '<a href="#" onclick="sortNow(&quot;name&quot;);return false;">Имя</a>', width: 80}
];

dp.contextMenu = new DayPilot.Menu({
    items: [
        {
            text: "Удалить", onclick: function () {
            var e = this.source;
            $.ajax({
                type: "DELETE",
                url: "/events/" + e.id() + "/",
                success: function (data) {
                    dp.message("Удалено");
                    loadEvents();
                }
            });
        }
        },
        {
            text: "Диалог", onclick: function () {
            dp.message("На стадии разработки");
        }
        }
    ],
    cssClassPrefix: "menu_default"
});


dp.onIncludeTimeCell = function (args) {
    if (args.cell.start.getHours() < 8) { // hide Sundays
        args.cell.visible = false;
    }

    /*
     * available:
     *
     * args.cell.start
     * args.cell.end
     * args.cell.visible
     */
};

dp.onTimeRangeSelected = function (args) {
    var description = prompt("Введите описание", "Ремонт двигателя RAV4");
    if (description == null)
        return;
    console.log("adding an event");
    // var url = "/new/start=" + args.start + "/end=" + args.end + "/resource=" + args.resource;
    // $('#ahref1').prop("href", url);
    // $('#ahref1').click();
    // $('#myModal').on('hidden.bs.modal', function () {
    //     dp.clearSelection();
    //     $('#myModal').removeData();
    //     loadEvents();
    // });
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "/events/";
    var xhr = new XMLHttpRequest();
    //var resultElement = document.getElementById('users_div');
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        dp.message("Работа добавлена");
        loadEvents();
        dp.update();
    });
    var sendObject = JSON.stringify({
        date_time_from: args.start,
        date_time_to: args.end,
        master_id: args.resource,
        text: description
    });
    console.log("Sending", sendObject);
    xhr.send(sendObject);
};

dp.onEventResized = function (args) {
    console.log("resizing a resourse " + args.e.text)
    console.log(args.e.id())
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "/events/" + args.e.id() + "/";
    var xhr = new XMLHttpRequest();
    //var resultElement = document.getElementById('users_div');
    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        dp.message("Изменение времени выполнено");
        dp.update();
    });
    var sendObject = JSON.stringify({
        date_time_from: args.newStart.toString(),
        date_time_to: args.newEnd.toString(),
    });
    console.log("Sending", sendObject);
    xhr.send(sendObject);
};

dp.onEventMoved = function (args) {
    console.log("moving a resourse")
    console.log(args.e.id())
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "/events/" + args.e.id() + "/";
    var xhr = new XMLHttpRequest();
    //var resultElement = document.getElementById('users_div');
    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        dp.message("Перенос работы выполнен");
        dp.update();
    });
    var sendObject = JSON.stringify({
        date_time_from: args.newStart.toString(),
        date_time_to: args.newEnd.toString(),
        master: args.newResource.toString(),
    });
    console.log("Sending", sendObject);
    xhr.send(sendObject);

};


dp.eventHeight = 50;

dp.onBeforeEventRender = function (args) {
    var start = new DayPilot.Date(args.e.start);
    var end = new DayPilot.Date(args.e.end);
    //var approved = args.e.approved;

    var today = DayPilot.Date.today();
    var now = new DayPilot.Date();
    var paidColor = "#aaaaaa";

    args.e.html = args.e.text;
    //if (approved) {
    args.e.barColor = 'green';
    args.e.html = args.e.html + "<br /><span style='color:gray' >" + start.toString("hh:mm") + "<br>" + end.toString("hh:mm") + "</span>";

    args.e.toolTip = args.e.bubbleHtml;
    args.e.html = args.e.html + "<br /><span style='color:gray' >" + start.toString("hh:mm") + "<br>" + end.toString("hh:mm") + "</span>";

    args.e.areas = [
        {
            bottom: 10,
            right: 4,
            html: "<div style='color:" + paidColor + "; font-size: 8pt;'><img src='/static/img/board-full.png'></div>",
            v: "Visible"
        },
    ];


}


dp.init();

loadResources();

function loadResources() {
    console.log("loading resourses")
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "/masters/";
    var xhr = new XMLHttpRequest();
    //var resultElement = document.getElementById('users_div');
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        if (this.status == 401) {
            dp.init();
        } else {
            var resources = new Array();
            for (var key = 0, size = data.length; key < size; key++) {
                resources.push({name: data[key]["name"], id: data[key]["id"], number: key + 1})
            }
            dp.resources = resources;
            dp.update();
        }
    });
    xhr.send(null);

    dp.businessBeginsHour = 8;
    dp.businessEndsHour = 24;
    //dp.showNonBusiness = false;
    //dp.daysOfWeek =

    dp.cellDuration = "30";

    dp.timeHeaders = [
        {groupBy: "Day", format: "d.MM"},
        {groupBy: "Hour", format: "H"},
        {groupBy: "Cell", format: "m"}
    ];
    dp.update();
}

loadEvents();

dp.scrollTo(new DayPilot.Date());

dp.heightSpec = "Max";
dp.height = $(window).height() * 0.75;

window.onresize = function () {
    dp.height = $(window).height() * 0.75;
    dp.update();
}

dp.onBeforeResHeaderRender = function (args) {

    args.resource.html = args.resource.number.toString();
    //args.resource.columns[0].html = '<div title="<img src=' + "'" + args.resource.photo+"'>"+'">'+args.resource.name+"</div>";
    args.resource.columns[0].html = args.resource.name;

};

function loadEvents() {
    var start = dp.visibleStart();
    var end = dp.visibleEnd();
    console.log("loading events")
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "/events/";
    var xhr = new XMLHttpRequest();
    //var resultElement = document.getElementById('users_div');
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        if (this.status == 401) {
            //resultElement.innerHTML = "Вход не выполнен";
        } else {
            var events = new Array();
            for (var key = 0, size = data.length; key < size; key++) {
                events.push({
                    text: data[key]["text"], id: data[key]["id"],
                    resource: data[key]["master_id"],
                    start: data[key]["date_time_from"],
                    end: data[key]["date_time_to"],
                    id: data[key]["id"]
                })
            }
            console.log(events);
            dp.events.list = events;
            // dp.events.list = [
            //     {
            //         start: "2017-07-04T10:00:00",
            //         end: "2017-07-04T11:30:00",
            //         id: "1",
            //         resource: 1,
            //         text: "Event 1"
            //     }
            // ];
            dp.update();
        }
    });
    xhr.send(null);

    $.get("/events/",
        {
            start: start.toString(),
            end: end.toString()
        },
        function (data) {
            //alert(data);
            //dp.events.list = data;
            //dp.update({events: $.parseJSON(data)});
        }
    )
    ;

}
$("#filter-sport").change(function () {
    loadResources();
});
$("#filter-lang").change(function () {
    loadResources();
});
document.getElementById('navigator').style.display = "none";
showCalendar = function () {
    var pos = $("#date_ahref").position();
    var pos1 = $("#dp-holder").position();
    //date_ahref
    $("#navigator").css({
        position: "absolute",
        top: pos.top + pos1.top + "px",
        left: pos.left + pos1.left + "px"
    }).show();
    document.getElementById('navigator').style.display = "block";
}

sortNow = function (e) {
    sorting = e;
    loadResources();
}