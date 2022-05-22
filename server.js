const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const https = require('https');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const http = require('http');
var session = require('express-session');
const cors = require('cors');
const { match } = require('assert');
app.use(cors());

const {
    render
} = require('express/lib/response');

app.use(session({
    secret: "hi",
    saveUninitialized: true,
    resave: true
}));

mongoose.connect("mongodb+srv://akamizuna:Mizuna1992@cluster0.bfw2e.mongodb.net/2537?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Listening", process.env.PORT || 5000);
})

// pokemonurl = "http://localhost:5000/";

const pokemonSchema = new mongoose.Schema({
    id: Number,
    name: String,
    abilities: [Object],
    stats: [Object],
    sprites: Object,
    types: [Object],
    weight: Number
}, { collection: 'pokemon' });

const typeSchema = new mongoose.Schema({
    name: String,
    id: Number,
    pokemon: [Object],
}, { collection: 'ability' });

const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String,
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    cart: {
        id: Number,
        quantity: Number
    }
});

const cartItemSchema = new mongoose.Schema({
    pokemon: String,
    image: String,
    quantity: Number,
    username: String,
});

const cartItemModel = new mongoose.model("cartitem", cartItemSchema);

const cartSchema = new mongoose.Schema({
    cartitem: [{
        _id:String,
        pokemon: String,
        image: String,
        quantity: Number,
    }],
    username: String,
})

const cartModel = new mongoose.model("cart", cartSchema);

const pokemonModel = mongoose.model('pokemon', pokemonSchema);
const typeModel = mongoose.model('ability', typeSchema);
const timelineModel = mongoose.model("timelines", timelineSchema);
const userModel = mongoose.model("users", userSchema)

// function authenticate(req, res, next) {
//     req.session.authenticated ? next() : req.redirect("/login");
// }

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static("public"))

// app.get("/profile/:id", function (req, res) {
//     const url = pokemonurl + `pokemon/${req.params.id}`;
//     data = "";

//     http.get(url, function (https_res) {
//       https_res.on("data", function (chunk) {
//         data += chunk;
//       });
//       https_res.on("end", function () {
//         res.render("profile.ejs", getPokemonData(data));
//       });
//     });
//   });


// function getPokemonData(data) {
//     data = JSON.parse(data);
//     console.log(data.name);
//     stats = Object.assign(
//         {},
//         { base_xp: data.base_experience }, data.stats.map((stats) => ({
//             [stats.stat.name]: stat.base_stat,
//         }))
//     );
//     abilities = data.abilities.map((ability) => {
//         return ability.ability.name;
//     });
//     pokemonData = {
//         name: data.name[0].toUpperCase() + data.name.slice(1),
//         img: data.sprites.other["official-artwork"].front_default,
//         stats: stats,
//     };
//     return pokemonData;
// }

// users = [
//     {
//         username:"jojo",
//         password:"123",
//         cart:[
//             {id:1, price: 1, number: 1},
//             {id:2, price: 1, number: 2}
//         ],
//     },
//     {
//         username:"okok", password:"fafa", cart:[]
//     },
// ];

app.post('/authenticate', function(req,res) {
    const {username, password} = req.body;
    res.send(req.body);
})

app.get('/profile/:id', function (req, res) {
    // console.log(req);

    // const url = `http://localhost:5000/pokemon/${req.params.id}`
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    data = " "
    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            data += chunk
        })

        https_res.on("end", function () {
            data = JSON.parse(data)

            tmp = data.filter((obj_) => {
                return obj_.name == "hp"
            }).map(
                (obj_2) => {
                    return obj_2.base_stat
                }
            )

            attack = data.filter((obj_) => {
                return obj_.name == "attack"
            }).map((obj2) => {
                return obj2.base_stat
            })

            defense = data.filter((obj_) => {
                return obj_.name == "defense"
            }).map((obj2)=>{
                return obj2.base_stat
            })

            special_attack = data.filter((obj_) => {
                return obj_.name == "special-attack"
            }).map((obj2)=>{
                return obj2.base_stat
            })

            speed = data.filter((obj_) => {
                return obj_.name == "speed"
            }).map((obj2)=>{
                return obj2.base_stat
            })

            res.render("profile.ejs", {
                "id": req.params.id,
                "name": data.name,
                "hp": tmp[0],
                "attack": attack,
                "defense": defense,
                "special_attack": special_attack,
                "speed": speed,
            });
        })
    });
})


// app.get('/', (req, res) => {
//     res.redirect('/index.html');
// })

app.get('/login', (req, res) =>{
    res.render("login.ejs");
})

app.get('/newacc', (req,res) => {
    res.render("newacc.ejs")
})

app.post('/login', (req, res) => {
    let usernameToCheck = req.body.username;
    let passwordToCheck = req.body.password;

    userModel.find({
        username: usernameToCheck,
        password: passwordToCheck
    }, (err, data) => {
        if (err) {
            console.log(err)
        }

        if (data.length != 0) {
            req.session.authenticated = true;
            req.session.username = data[0].username;

            res.send(true);
        } else {
            res.send(false);
        }
    })
})

function existinguser(user, callback) {
    userModel.find({
        username: user
    }, (err,data) => {
        if(err) {
            console.log(err)
        }
        return callback(data.length != 0);
    })
}

app.post('/newacc', (req,res) => {
    let existinguser;
    existinguser(req.body.username, (response) => {
        existinguser = response;
    })
    if(!existinguser) {
        userModel.create({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            cart: {},
        }, (err, data) => {
            if(err) {
                console.log(err);
            }
            req.session.authenticated = true;
            req.session.username = data.username;
            res.send(data.name);
        })
        }
        else {
            res.send(true);
    }
})
// app.get("/userprofile/:name", auth, function(req,res){

// });

app.get('/loggedin', (req, res) => {
    if(req.session.authenticated) {
        res.send(true);
    } else {
        res.send(false);
    }
})

app.get('/logout', (req,res) => {
    req.session.authenticated = false;
    req.session.username =undefined;
    res.render('login.ejs');
})

app.get('/pokemon/:name', (req, res) => {
    let query = isNaN(req.params.name) ? { name: req.params.name } : { id: req.params.name };
    pokemonModel.find(query, (err, body) => {
        if (err) throw err;
        res.send(body);
    })
})


app.get('/ability/:name', (req, res) => {
    typeModel.find({ name: req.params.name }, (err, body) => {
        if (err) throw err;
        res.send(body);
    })
})

app.get('/timeline/getAllEvents', function (req, res) {
    timelineModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            // console.log("Data " + data);
        }
        console.log(data);
        res.send(data);
    });
})

app.post('/timeline/insert', function (req, res) {
    timelineModel.create({
        'text': req.body.text,
        'time': req.body.time,
        'hits': req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Insertion is successful!");
    });
})

app.get("/timeline/remove/:id", function (req, res) {
    timelineModel.deleteOne(
      {
        _id: req.params.id,
      },
      function (err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Deleted: \n" + data);
        }
        res.send("Delete is good!");
      }
    );
  });

  app.get("/timeline/removeAll", function (req, res) {
    timelineModel.deleteMany(
      {
        hits: { $gt: 0 },
      },
      function (err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Deleted all");
        }
        res.send("Deleted all!");
      }
    );
  });

  app.get("/timeline/like/:id", function (req,res) {
      timelineModel.updateOne(
          {
              _id: req.params.id,
          }, {
            $inc: {hits:1},
          },
          function (err, data)
          {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Liked: \n" + data);
            }
            res.send("Update is good!");
          }
      )
  })




app.use(express.static('./public'));