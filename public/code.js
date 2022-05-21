to_add = ''
const cardColors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#F4e7da',
    rock: 'd5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#98b3e6',
    psychic: '#eaeda1',
    flying: 'F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};
const main_types = Object.keys(cardColors)
// "http://localhost:5000"

function processPokemonResponse(data) {
    // console.log(data)
    const pokemon_types = data.types.map(type => type.type.name);
    const type = main_types.find(type => pokemon_types.indexOf(type) > -1);
    const colour = cardColors[type];
    to_add += `<div class="image_container" style = "background-color: ${colour}" onclick="profilechecked('${data.name}')">
    <a href= "/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"> </a>
    <div> ${data.name} </div>
    <div> ${data.base_experience}</div>
    </div>`

}
async function loadNineImages() {
    for (i = 1; i <= 9; i++) { // Nine times
        if (i % 3 == 1) {
            to_add += `<div class="images_group">`
        }

        x = Math.floor(Math.random() * 30) + 1
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${x}/`,
            success: processPokemonResponse
        })
        if (i % 3 == 0) {
            to_add += `</div>`
        }
    }
    jQuery("main").html(to_add)
}

function setup() {
    loadNineImages();
}

$(document).ready(setup)