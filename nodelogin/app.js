const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const {log} = require("util");
const pug = require("pug");
const {ER_ACCESS_DENIED_CHANGE_USER_ERROR} = require("mysql/lib/protocol/constants/errors");
const {RowDataPacket} = require("mysql/lib/protocol/packets");




const accountConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Antwort42',
    database : 'Webengineering'
});

const loginFailedHeaderKey = "loginFailed";

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


// http://localhost:3000/
app.get('/', function(request, response) {
    // Render login template
    response.sendFile(path.join(__dirname + '/public/login.html'));
});


// http://localhost:3000/auth
// checks the users inputs and validates them
app.post('/auth', function(request, response) {
    // Capture the input fields
    let username = request.body.login_username;
    let password = request.body.login_pswd;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        accountConnection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                request.session.loggedin = true;
                request.session.username = username;
                // Redirect to home page
                response.redirect('/home');
            } else {
                response.setHeader(loginFailedHeaderKey, 1);
                response.redirect('/');



            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});


app.post('/register', function (request, response){
    let query = 'INSERT INTO accounts (username, password, email) VALUES?;';
    let values = [
        [request.body.signup_username, request.body.signup_pswd, request.body.signup_email]
    ]
    accountConnection.query(query, [values]);
    request.session.username = request.body.signup_username;
    request.session.loggedin = true;
    response.redirect("/home");
})

async function getBienenStoecke(username){
    let UsersBienenStoecke =  [];

    let userID = 0;
    accountConnection.query('SELECT Id from accounts WHERE username = ?', [username], function(error, results, fields){
        userID = parseInt(results[0]['Id']);

    })
    await delay(0.01);
    await accountConnection.query('SELECT * from bienenstoecke WHERE FKaccountID = ?', [userID], function (error, result, fields){
        for(let i = 0; i < result.length; i++) {
            let BienenStock = {
                StockId         : result[i]['StockId'],
                Namen           : result[i]['Namen'],
                Koenigin        : result[i]['Koenigin'],
                Staerke         : result[i]['Volkssaerke'],
                Futter          : result[i]['Futter'],
                HonigEntnommen  : result[i]['HonigEntnommen'],
                Wabensitz       : result[i]['Wabensitz']
            }
            console.log('In Query, Bienenstock: ' );
            console.log(BienenStock);
            UsersBienenStoecke.push(BienenStock);
        };
    });
    return UsersBienenStoecke;
}

const delay = seconds => {
    return new Promise (
        resolve => setTimeout (resolve, seconds * 1000)
    )
};

// http://localhost:3000/home
app.get('/home', async function (request, response) {
    if (request.session.loggedin) {
        let BienenStoecke = await getBienenStoecke(request.session.username);
        await delay(0.01);
        // Output username
        console.log("User is successfully logged in")
        response.render(
            'index',
            {
                username: request.session.username,
                stockcards: BienenStoecke
            }
        )
    } else {
        response.redirect("/");
    }
});

app.get('/Logout', function(request, response){
    request.session.loggedin = false;
    request.session.username = "";
    console.log("User is logged out")
    response.redirect("/");
})

app.get('/addCard', async function(request, response){
    let userID = 0;
    accountConnection.query('SELECT Id from accounts WHERE username = ?', [request.session.username], function(error, results, fields){
        userID = parseInt(results[0]['Id']);

    })
    let Values = [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        userID]
    accountConnection.query('INSERT INTO bienenstoecke (Namen, Koenigin, Volkssarke, Futter, HonigEntnommen, Wabensitz, FKaccountID) VALUES?', Values)

    response.redirect('/home');
})

app.post('/addCard', async function (request, response){

    let query = `UPDATE bienenstoecke SET Namen = "${request.body.Namen}", Koenigin = "${request.body.Koenigin}", Volkssaerke = "${request.body.Staerke}", Futter = "${request.body.Futter}", HonigEntnommen = "${request.body.HonigEntnommen}",  Wabensitz = "${request.body.Wabensitz}" WHERE StockId = "${request.body.StockId}"`;
    console.log("Values of new Card")
    console.log(query);
    accountConnection.query(query);
    await delay(0.05);
    response.redirect('/home');
})

app.post('/delCard', async function(request, response){
    accountConnection.query(`DELETE from bienenstoecke where StockId = "${request.body.StockId}";`);
    await delay(0.05);
    response.redirect('/home');
})
app.get('/3d', function(request, response){
    if(request.session.loggedin) {
        response.sendFile(path.join(__dirname + "/public/homepage/subpages/3d.html"));
    }else{
        response.redirect('/home');
    }
})

app.get('/draw', function(request, response){
    if(request.session.loggedin) {
        response.sendFile(path.join(__dirname + "/public/homepage/subpages/draw.html"));
    }else{
        response.redirect('/');
    }
})

app.get('/fav', function(request, response){
    if(request.session.loggedin) {
        response.sendFile(path.join(__dirname + "/public/homepage/subpages/fav.html"));
    }else{
        response.redirect('/');
    }
})



app.listen(3000);