function deleteTransaction(id, name) {
    if (confirm("Удалить " + name + "?")) {
        var token = localStorage.getItem('token');
        var url = "/transactions/" + id.toString() + "/"
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

function openEditTransactionForm(data) {
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


function getTransactions() {
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "/transactions/";

    //url += filter;
    console.log("Querying " + url);
    var xhr = new XMLHttpRequest();
    var statusElement = document.getElementById('global_status');
    var resultElement = document.getElementById('div_transactions');
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
            tableHeader += "<thead><tr><th>Дата</th><th>Операция</th><th>Сумма</th>";
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
                r[++j] = '<td>' + data[key]["date_time"].substring(0,10) + "</td>";
                r[++j] = '<td>' + data[key]["text"].replace(/<(?:.|\n)*?>/gm, '') + "</td>";
                r[++j] = '<td>' + data[key]["amount"] + "</td>";
                r[++j] = '<td>' + "</td>";
                r[++j] = '<td> ' +
                    ' <a href="#" onclick="deleteTransaction(' + data[key]["id"] + ", '" + data[key]["text"] + "'" + ')">Удалить ✘</a> </td>';
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

$('#form_new_transaction').submit(function (e) {
        var text = $('#new_transaction_text').val();
        var amount = $('#new_transaction_amount').val();
        console.log("adding a transaction");
        var token = localStorage.getItem('token');
        var user = localStorage.getItem('username');
        var url = "/transactions/";
        var xhr = new XMLHttpRequest();
        //var resultElement = document.getElementById('users_div');
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader("Authorization", "JWT " + token);
        xhr.addEventListener('load', function () {
            var data = JSON.parse(this.response);
            console.log(data);
            if (this.status == 201) {
                $("#new_transaction_text").val("");
                $("#new_transaction_amount").val("");
                $("#new_transaction_text").focus();
                load_all();
            }
        });
        var sendObject = JSON.stringify({
            text: text,
            amount: amount
        });
        console.log("Sending", sendObject);
        xhr.send(sendObject);
        e.preventDefault();
    });