var editMealId;
var times = 0;

function getToken() {
    var loginUrl = "/auth/"
    var xhr = new XMLHttpRequest();
    var userElement = document.getElementById('username');
    var passwordElement = document.getElementById('password');
    var resultElement = document.getElementById('result');
    var errorElement = document.getElementById('login-error-div');
    var user = userElement.value;
    var password = passwordElement.value;
    errorElement.innerHTML = "";
    xhr.open('POST', loginUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var responseObject = JSON.parse(this.response);
        console.log(responseObject);
        if (responseObject.token) {
            localStorage.setItem('token', responseObject.token);
            localStorage.setItem('username', user);
            load_all();
            $('#myModal').modal('hide');
            return (true);
        } else {
            if (responseObject.non_field_errors) {
                errorElement.innerHTML = responseObject.non_field_errors;
                if (responseObject.non_field_errors.toString().indexOf("not verified") > 0)
                    errorElement.innerHTML = responseObject.non_field_errors + "<br><a href='#' onclick='send_verification_code(" + '"' + user + '"' + ")'>Send verification code</a>";
            }

            return (false);
        }
    });

    var sendObject = JSON.stringify({username: user, password: password});

    console.log('going to send', sendObject);

    xhr.send(sendObject);
}

function send_verification_code(username) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/users/" + username + "/send_verification_code", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.addEventListener('load', function () {
        var responseObject = JSON.parse(this.response);
        alert(responseObject.detail);
    });

    var sendObject = JSON.stringify({username: username});

    //console.log('going to send', sendObject);

    xhr.send(sendObject);
}

function logout() {
    localStorage.setItem('token', "");
    load_all();
}

function load_all() {
    getMasters();
    getUsers();
    loadResources();
    loadEvents();
}
function onLoad() {

    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

    $("#user-settings-form").submit(function (event) {
        event.preventDefault();
        saveUserSettings();
    });
    load_all();
    $(document).on('hidden.bs.modal', function (e) {
        load_all();
    });
    $("#login-form").submit(function (event) {
        loginFromModal(event);
        event.preventDefault();
    });
    $("#register-form").submit(function (event) {
        registerFromModal(event);
        event.preventDefault();
    });
    $("#form_new_meal").submit(function (event) {
        newMeal(event);
        event.preventDefault();
    });
    $("#edit_meal_form").submit(function (event) {
        saveChanges();
        event.preventDefault();
    });
    $("#filter_form").submit(function (event) {
        load_all();
        event.preventDefault();
    });
}
function loginFromModal(e) {
    if (getToken() == true)
        $('#myModal').modal('hide');
}
function registerFromModal(e) {
    register();
    event.preventDefault();
}

