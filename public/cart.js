$("#back").click(function () {
    window.location.href = 'http://localhost:5000/index.html';
})

function loadEventsToMainDiv() {
    $.ajax({
        url: "http://localhost:5000/cart/getAllEvents",
        type: "get",
        success: (r)=>{
            console.log(r)
            countq = r[0].cart.length
            for( i = 0 ; i < countq; i++ ){
                pokemonID = r[0].cart[i].id
                cost = r[0].cart[i].cost
                count = r[0].cart[i].count
                pid = r[0].cart[i].id
                $.ajax({
                    type: "get",
                    url: `https://pokeapi.co/api/v2/pokemon/${pokemonID}`,
                    success: (data)=> {
                        const upperCaseName = data.name[0].toUpperCase() + data.name.slice(1);
                        $("#box").append(`
                        <div class="image_container">
                            <a href="/profile/${data.id}">
                            <img src="${data.sprites.other["official-artwork"].front_default}">
                            </a>
                            <div> ID - ${data.id} </div>
                            <div> Name - ${upperCaseName} </div>
                            <div> Cost - ${cost} </div>
                            <div> Count - ${count} </div>
                            <button class="checkout" onClick="window.location.reload(true)" id="${data.id}"> Checkout! </button>
                            <button class="deleteButtons" onClick="window.location.reload(true)" id="${data.id}"> Delete </button>
                        <div>
                            `)
                        $("#box").append(`</text`)

                    }
                })

            }
        }
    })
}

function loadtoorders() {
    $.ajax({
        url: "http://localhost:5000/cart/getAllEvents",
        type: "get",
        success: (r)=>{
            console.log(r)
            countq = r[0].orders.length
            for( i = 0 ; i < countq; i++ ){
                pokemonID = r[0].orders[i].id
                cost = r[0].orders[i].cost
                count = r[0].orders[i].count
                $.ajax({
                    type: "get",
                    url: `https://pokeapi.co/api/v2/pokemon/${pokemonID}`,
                    success: (data)=> {
                        const upperCaseName = data.name[0].toUpperCase() + data.name.slice(1);
                        $("#box2").append(`
                        <div class="image_container">
                            <a href="/profile/${data.id}">
                            <img src="${data.sprites.other["official-artwork"].front_default}">
                            </a>
                            <div> ID - ${data.id} </div>
                            <div> Name - ${upperCaseName} </div>
                            <div> Cost - ${cost} </div>
                            <div> Count - ${count} </div>
                            <button class="dButtons" onClick="window.location.reload(true)" id="${data.id}"> Delete </button>
                        <div>
                            `)
                        $("#box").append(`</text`)

                    }
                })

            }
        }
    })

}

function checkout(){
    x = this.id
    $.ajax({
        url: `http://localhost:5000/checkout/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
        }
    })

    $.ajax({
        url: `http://localhost:5000/delete/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
        }
    })
}

function deleteall() {
    x = this.id
    $.ajax({
        url: `http://localhost:5000/delete/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
        }
    })
}

function dall() {
    x = this.id
    $.ajax({
        url: `http://localhost:5000/deleteOrder/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
        }
    })
}

function setup(){
    loadEventsToMainDiv();
    loadtoorders();

    $("main").on("click", ".checkout", checkout)
    $("main").on("click", ".deleteButtons", deleteall)
    $("main").on("click", ".dButtons", dall)
}

$(document).ready(setup)