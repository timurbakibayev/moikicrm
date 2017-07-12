function deleteMaster(id, name) {
    if (confirm("Удалить " + name + "?")) {
        var token = localStorage.getItem('token');
        var url = "/masters/" + id.toString() + "/"
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', url, true);
        xhr.setRequestHeader("Authorization", "JWT " + token);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.addEventListener('load', function () {
            load_all();
        });
        xhr.send(null);
    }
}

function openEditForm(data) {
    var token = localStorage.getItem('token');
    var url = "/meals/"
    var xhr = new XMLHttpRequest();
    var modalHeader = document.getElementById('edit_modal_header');
    modalHeader.innerHTML = "Edit '" + data["text"] + "'";
    window.editMealId = data["id"];
    $('#edit_text').val(data["text"]);
    $('#edit_date').val(data["date"]);
    $('#edit_time').val(data["time"]);
    $('#edit_calories').val(data["calories"]);
    $('#editModalForm').modal('show');
}

function saveChanges() {
    var mealId = window.editMealId.toString();
    $('#editModalForm').modal('hide');
    var editText = $('#edit_text').val();
    var editDate = $('#edit_date').val();
    var editTime = $('#edit_time').val();
    var editCalories = $('#edit_calories').val();

    var token = localStorage.getItem('token');
    var url = "/meals/" + mealId + "/";
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var responseObject = JSON.parse(this.response);
        console.log(responseObject);
        if (this.status < 300) {
            load_all();
        } else {
            var errors = "";
            if (responseObject.detail)
                errors = responseObject.detail;
            else {
                for (var k in responseObject) {
                    if (responseObject.hasOwnProperty(k)) {
                        console.log(k + ": " + responseObject[k]);
                        errors += k + ": " + responseObject[k] + "\n";
                    }
                }
                if (errors == "")
                    errors = "Something wrong just happened";
                alert(errors);
            }
        }
    });
    var sendObject = JSON.stringify({
        text: editText,
        date: editDate,
        time: editTime,
        calories: editCalories
    });
    console.log("Sending", sendObject);
    xhr.send(sendObject);
}

function saveUserSettings() {
    $('#myModalDaily').modal('hide');
    var settingsCalories = parseInt($('#settings_calories').val());
    var settingsPassword = $('#settings_password').val();

    var token = localStorage.getItem('token');
    var url = "/users/" + localStorage.getItem("user_id") + "/";
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var responseObject = JSON.parse(this.response);
        console.log(responseObject);
        if (this.status < 300) {
            load_all();
        } else {
            var errors = "";
            if (responseObject.detail)
                errors = responseObject.detail;
            else {
                for (var k in responseObject) {
                    if (responseObject.hasOwnProperty(k)) {
                        console.log(k + ": " + responseObject[k]);
                        errors += k + ": " + responseObject[k] + "\n";
                    }
                }
                if (errors == "")
                    errors = "Something wrong just happened";
                alert(errors);
            }
        }
    });
    var sendObject = JSON.stringify({
        calories: settingsCalories,
        password: settingsPassword
    });
    if (settingsPassword === "")
        sendObject = JSON.stringify({
            calories: settingsCalories
        });
    console.log(settingsPassword);
    console.log("URL", url);
    console.log("Sending", sendObject);
    xhr.send(sendObject);
}


function getMasters() {
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "/masters/";

    //url += filter;
    console.log("Querying " + url);
    var xhr = new XMLHttpRequest();
    var statusElement = document.getElementById('global_status');
    var resultElement = document.getElementById('result');
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        if (this.status == 401) {
            document.getElementById("login_button").style.visibility = "visible";
            document.getElementById("logout_button").style.visibility = "hidden";
            resultElement.innerHTML = "";
            statusElement.innerHTML = "Вход не выполнен";
        } else {
            document.getElementById("login_button").style.visibility = "hidden";
            document.getElementById("logout_button").style.visibility = "visible";
            document.getElementById("logout_button").textContent = "Выйти " + user;

            var tableHeader = '<table class="table">';
            tableHeader += "<thead><tr><th>Мастер</th><th></th><th></th>";
            tableHeader += "<th></th>";
            tableHeader += "<th></th></tr></thead>";

            var r = new Array(), j = -1;
            var c = 0;
            for (var key = 0, size = data.length; key < size; key++) {
                console.log(data[key]["text"])
                if (data[key]["id"] == window.editMealId)
                    r[++j] = '<tr class="changed">';
                else
                    r[++j] = '<tr>';
                r[++j] = '<td>' + data[key]["name"].replace(/<(?:.|\n)*?>/gm, '') + "</td>";
                r[++j] = '<td>' + "</td>";
                r[++j] = '<td>'  + "</td>";
                r[++j] = '<td>' + "</td>";
                r[++j] = '<td> ' +
                    ' <a href="#" onclick="deleteMaster(' + data[key]["id"] + ", '" + data[key]["name"] + "'" + ')">Удалить ✘</a> </td>';
                r[++j] = '</tr>';
            }

            resultElement.innerHTML = tableHeader + r.join('') + "</table>";
            window.times -= 1;
            // if (window.times <= 0)
            //     window.editMealId = "-1";
        }
    });
    xhr.send(null);
}
