// function login() {
//     const username = $("#username").val();
//     const password = $("#password").val();

//     $.ajax({
//         url: 'localhost:5000/authenticate',
//         type: 'POST',
//         data: {
//             username: username,
//             password: password,
//         },
//         success: function(res){
//             console.log(res);
//         }
//     })
// }

// function setup() {
//     $("#submit").click(login());
// }

// $(document).ready(setup);