type_g = ''
storage = ''
add_to = ''
currentPage = 0
pokemonPage = 10

// const cardColors = {
//     fire: '#FDDFDF',
//     grass: '#DEFDE0',
//     electric: '#FCF7DE',
//     water: '#DEF3FD',
//     ground: '#F4e7da',
//     rock: 'd5d5d4',
//     fairy: '#fceaff',
//     poison: '#98d7a5',
//     bug: '#f8d5a3',
//     dragon: '#98b3e6',
//     psychic: '#eaeda1',
//     flying: 'F5F5F5',
//     fighting: '#E6E0D4',
//     normal: '#F5F5F5'
// };
// const main_types = Object.keys(cardColors)
function processPokeResponse(data) {
    // const pokemon_types = data.types.map(type => type.type.name);
    // const type = main_types.find(type => pokemon_types.indexOf(type) > -1);
    // const colour = cardColors[type];
    for (i = 0; i < data.types.length; i++) {
        if (data.types[i].type.name == type_g) {
            // $("main").append("<p>" + data.id + "</p>")
            $("main").append(`
                <div class="card">
                <a href="../profile/${data.id}"><img src="${data.sprites.other["official-artwork"].front_default}">${data.name}</a>
                </div>`)
        }
    }
}

function searchPokemonName() {
    searchreq = $("#pokemonName").val().toLowerCase()
    $.ajax({
        type: "get",
        url: `http://localhost:5000/pokemon/${searchreq}`,
        success: singlePokemon
    })
    $("main").empty()
}

function singlePokemon(data) {
    $("main").append(`
        <div class="card">
        <a href="../profile/${data.id}"><img src="${data.sprites.other["official-artwork"].front_default}" >
            <div> ${data.name}</div>
            </a>
        </div>
    `)
    getHistory(data);
}

function getHistory(data) {
    $('.history').append(`
                <div>
                    <a href="../profile/${data.id}">${data.name}</a>
                </div>
                `)
}

function processPokeRegion(data) {
    storage = data.results;
    for (i = 0; i < data.results.length; i++) {
        // $("main").append(`<div>${data.results[i].name}</div>`)
        $("main").append(`
        <div class="card">
        <a href= "/profile/${getID(data.results[i].url)}">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getID(data.results[i].url)}.png">
        <div>${data.results[i].name}</div></a>
        </div>`)
    }
}

function getID(url) {
    return url.split('pokemon/')[1].split('/')[0]
}

function sortProcess() {
    for (i = 0; i < storage.length; i++) {
        // $("main").append(`<div>${storage[i].name}</div>`)
        $("main").append(`
        <div class="card">
        <a href= "/profile/${getID(storage[i].url)}">
        <div>${storage[i].name}</div>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getID(storage[i].url)}.png"></a>
        </div>`)
    }
}

function display(type_) {
    $("main").empty()
    type_g = type_
    for (i = 1; i < 899; i++) {
        // for each pokemon
        $.ajax({
            type: "get",
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processPokeResponse
        })
    }
}

function displayRegion(start, end) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://localhost:5000/pokemon/?limit=${end}&offset=${start}`,
        success: processPokeRegion
    })
}


function sortByName() {
    searchType = $('#search-sort').val();
    if (searchType === 'name') {
        storage.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        })
        // $('#poke-container').empty()
    }
    if (searchType === 'id') {
        storage.sort((a, b) => {
            return getID(a.url) - getID(b.url)
        })
        // $('#poke-container').empty()
    }
    // console.log(storage)
    $('main').empty()
    sortProcess()
}

function nextPage() {


}

function prevPage() {
    if (currentPage > 0) {
        currentPage - 1;
    }
    var x = currentPage * pokemonPage
    for (i = 0; i < pokemonPage; i++) {
        console.log(storage[x + 1].name);
    }
}

function setup() {

    display($("#poke_type option:selected").val());

    $("#poke_type").change(() => {
        // alert($(this).attr("value"));
        poke_type = $("#poke_type option:selected").val();
        display(poke_type);
    })

    $("#region").change(() => {
        pokeregion = $("#region option:selected").val();
        switch (pokeregion) {
            case 'kanto':
                displayRegion(0, 151)
                break;
            case 'johto':
                displayRegion(151, 251)
                break
            case 'hoenn':
                displayRegion(251, 386)
                break
            case 'sinnoh':
                displayRegion(386, 494)
                break
            case 'unova':
                displayRegion(494, 649)
                break
            case 'kalos':
                displayRegion(649, 721)
                break
            case 'alola':
                displayRegion(721, 809)
                break
            case 'galar':
                displayRegion(809, 898)
                break
            default:
                console.log('This shouldnt happen')
                break
        }
    })

    $("#search-sort").change(() => {
        sortByName();
    })
    $("#searchPokemon").click(() => {
        searchPokemonName();
    })
    $('#first').click(() => changePage(0))
    $('#prev').click(() => prevPage())
    $('#next').click(() => nextPage())
    $('#last').click(() => changePage(getPageNum() - 1))
}


$(document).ready(setup) 