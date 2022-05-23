
function loadEvents() {
    $('#events').empty();
    $.ajax({
        url: "http://localhost:5000/timeline/getAllEvents",
        type: "get",
        success: (r) => {
            for(i = 0; i < r.length; i ++){
                console.log(r[i].text);
                let id = r[i]["_id"];
                $('#events').append(
                    `
                    <div class="event" id="${id}>
                    <span class="eventtime">${r[i].time}<span>
                    <span>${r[i].text}<span>
                    <button class="like-button" onclick="likeEvent('${id}')">Like</button>
                    <span class="counter">${r[i].hits}<span></span>
                    <button class="deletebutton" onclick=deleteEvent('${id}')>Delete</button>
                    </div>
                    `
                )
            }
        }
    })
}

var time = new Date();

function profilechecked(pokemonName) {
    $.ajax({
        url: `/timeline/insert`,
        type: "POST",
        data: {
            text: `${pokemonName} viewed`,
            time: time.toLocaleTimeString(),
            hits: 1
         },
         success: (data) => {
            // console.log(data);
            loadEvents();
         }
    })
}

function addcart() {
    i = this.id / 10;
    console.log(x);
    $.ajax({
        url: `http://localhost:5000/cart/insert/${i}`,
        type: "get",
        success: function (a) {
            if(a) {
                window.alert(`Id: ${i} card was added to your cart`);
            } else {
                window.alert(`Please login before add to cart`);
            }
        }
    })
}

function deleteEvent(id) {
    $.ajax({
        url: `/timeline/remove/${id}`,
        type: "GET",
        success: ()=> {
            loadEvents();
        }
    })
}

function clearEvents() {
    $.ajax({
        url: `/timeline/removeAll`,
        type: "GET",
        success: () => {
            loadEvents();
        }
    })
}

function likeEvent(id) {
    $.ajax({
      url: `/timeline/like/${id}`,
      type: "GET",
      success: () => {
        loadEvents();
      },
    });
  }


function setup() {
    loadEvents();
}
$(document).ready(setup);