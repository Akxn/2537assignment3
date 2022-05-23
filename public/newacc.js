function saveToDB() {
    let username = $('#username-text-field').val();
    let password = $('#password-text-field').val();
    let firstname = $('#first-name-field').val();
    let lastname = $('#last-name-field').val();
    let age = $('#age-text-field').val();

    $.ajax({
        url: '/newacc',
        type: 'POST',
        data: {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            age: age
        },
        success: processSignUp
    })
}

function processSignUp(data) {
    console.log(data);
    if(data == true) {
        window.alert("username is taken!!")
    } else {
        window.alert(`You have signed up!!`);
        window.location.href = "http://localhost:5000/login";
    }
}

function setup() {
    $("#signup-button").click(saveToDB);
}

$(document).ready(setup);