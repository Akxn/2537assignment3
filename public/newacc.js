function saveToDB() {
    let username = $('#username-text-field').val();
    let password = $('#password-text-field').val();
    let name = $('#name-text-field').val();

    $.ajax({
        url: '/newacc',
        type: 'POST',
        data: {
            username: username,
            password: password,
            name: name
        },
        success: processSignUp
    })
}

function processSignUp(data) {
    if(data == true) {
        window.alert("username is taken!!")
    } else {
        window.alert(`You have signed up!!`);
        // window.location.href = "localhost:5000/login";
    }
}

function setup() {
    $("#signup-button").click(saveToDB);
}

$(document).ready(setup);