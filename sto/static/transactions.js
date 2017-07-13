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
    var modalHeader = document.getElementById('edit_modal_header');
    modalHeader.innerHTML = "Редактирование операции '" + data["text"] + "'";
    window.editTransactionId = data["id"];
    $('#edit_text').val(data["text"]);
    $('#edit_amount').val(data["amount"]);
    $('#editModalForm').modal('show');
}


function editTransaction(id) {
    var token = localStorage.getItem('token');
    var url = "/transactions/" + id.toString() + "/";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        console.log(this.status);
        openEditTransactionForm(data);
    });
    xhr.send(null);
}

function saveTransactionChanges() {
    var transactionId = window.editTransactionId.toString();
    $('#editModalForm').modal('hide');
    var editText = $('#edit_text').val();
    var editAmount = $('#edit_amount').val();

    var token = localStorage.getItem('token');
    var url = "/transactions/" + transactionId + "/";
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
        amount: editAmount
    });
    console.log("Sending", sendObject);
    xhr.send(sendObject);
}



function getTransactions() {
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('username');
    var url = "/transactions/";

    //url += filter;
    console.log("Querying " + url);
    var xhr = new XMLHttpRequest();
    var statusElement = document.getElementById('global_status');
    var resultElementI = document.getElementById('div_transactions_income');
    var resultElementE = document.getElementById('div_transactions_expenses');
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Authorization", "JWT " + token);
    xhr.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        console.log(data);
        if (this.status == 401) {
            document.getElementById("login_button").style.visibility = "visible";
            document.getElementById("logout_button").style.visibility = "hidden";
            resultElementI.innerHTML = "";
            resultElementE.innerHTML = "";
            statusElementI.innerHTML = "Вход не выполнен";
            statusElementE.innerHTML = "Вход не выполнен";
        } else {
            document.getElementById("login_button").style.visibility = "hidden";
            document.getElementById("logout_button").style.visibility = "visible";
            document.getElementById("logout_button").textContent = "Выйти " + user;

            var tableHeader = '<table class="table">';
            tableHeader += "<thead><tr><th>Дата</th><th>Операция</th><th>Сумма</th>";
            tableHeader += "<th></th>";
            tableHeader += "<th></th></tr></thead>";

            var rI = new Array(), j = -1;
            var rE = new Array(), j = -1;
            var c = 0;
            for (var key = 0, size = data.length; key < size; key++) {
                console.log(data[key]["text"]);
                if (data[key]["amount"]>0) {
                    if (data[key]["id"] == window.editTransactionId)
                        rI[++j] = '<tr class="changed">';
                    else
                        rI[++j] = '<tr>';
                    rI[++j] = '<td>' + data[key]["date_time"].substring(0, 16) + "</td>";//10
                    rI[++j] = '<td>' + data[key]["text"].replace(/<(?:.|\n)*?>/gm, '') + "</td>";
                    rI[++j] = '<td style="color: green">' + data[key]["amount"] + "</td>";
                    rI[++j] = '<td>' + "</td>";
                    rI[++j] = '<td> ' + '<a href="#" onclick="editTransaction(' + data[key]["id"] + ')">Ред. ✍ </a> '+
                        ' <a href="#" onclick="deleteTransaction(' + data[key]["id"] + ", '" + data[key]["text"] + "'" + ')">Удалить ✘</a> </td>';
                    rI[++j] = '</tr>';
                } else {
                    if (data[key]["id"] == window.editTransactionId)
                        rE[++j] = '<tr class="changed">';
                    else
                        rE[++j] = '<tr>';
                    rE[++j] = '<td>' + data[key]["date_time"].substring(0, 16) + "</td>"; //10
                    rE[++j] = '<td>' + data[key]["text"].replace(/<(?:.|\n)*?>/gm, '') + "</td>";
                    rE[++j] = '<td style="color: red">' + -data[key]["amount"] + "</td>";
                    rE[++j] = '<td>' + "</td>";
                    rE[++j] = '<td> ' + '<a href="#" onclick="editTransaction(' + data[key]["id"] + ')">Ред. ✍ </a> '+
                        ' <a href="#" onclick="deleteTransaction(' + data[key]["id"] + ", '" + data[key]["text"] + "'" + ')">Удалить ✘</a> </td>';
                    rE[++j] = '</tr>';
                }
            }

            resultElementI.innerHTML = tableHeader + rI.join('') + "</table>";
            resultElementE.innerHTML = tableHeader + rE.join('') + "</table>";
            window.times -= 1;
            // if (window.times <= 0)
            //     window.editMealId = "-1";
        }
    });
    xhr.send(null);
}

$('#form_new_transaction_income').submit(function (e) {
        var text = $('#new_transaction_i_text').val();
        var amount = $('#new_transaction_i_amount').val();
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
                window.editTransactionId = data["id"];
                $("#new_transaction_i_text").val("");
                $("#new_transaction_i_amount").val("");
                $("#new_transaction_i_text").focus();
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

$('#form_new_transaction_expenses').submit(function (e) {
        var text = $('#new_transaction_e_text').val();
        var amount = $('#new_transaction_e_amount').val();
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
                window.editTransactionId = data["id"];
                $("#new_transaction_e_text").val("");
                $("#new_transaction_e_amount").val("");
                $("#new_transaction_e_text").focus();
                load_all();
            }
        });
        var sendObject = JSON.stringify({
            text: text,
            amount: -amount
        });
        console.log("Sending", sendObject);
        xhr.send(sendObject);
        e.preventDefault();
    });