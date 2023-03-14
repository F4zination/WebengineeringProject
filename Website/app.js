const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');




// creates a connection to the Database
const accountConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Antwort42',
    database : 'Webengineering'
});

// initialisation and configuring the app
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
// default route will return to the login/register page
app.get('/', function(request, response) {
    // Render login template
    response.sendFile(path.join(__dirname + '/public/login.html'));
});


// http://localhost:3000/auth
// checks the users login credentials, validates them and if right redirects to /home else redirect to /
app.post('/auth', function(request, response) {

    // Capture the input fields which cannot be NULL
    let username = request.body.login_username;
    let password = request.body.login_pswd;

    // Output username
    console.log(`User ${request.session.username} is successfully logged in`)

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
            // set Header loginFailed to 1 and redirect to /
            response.setHeader('loginFailed', 1);
            response.redirect('/');



        }
        response.end();
    });
});

// inserts a new User into the DB and redirects him as a logged-in User to /home
app.post('/register', function (request, response){

    // SQL Statement to insert a new User into the Database
    let query = 'INSERT INTO accounts (username, password, email) VALUES?;';

    // Values that get saved to the DB
    let values = [
        [request.body.signup_username, request.body.signup_pswd, request.body.signup_email]
    ]
    accountConnection.query(query, [values]);

    // Setting the session-variables
    request.session.username = request.body.signup_username;
    request.session.loggedin = true;

    // Redirect to home page as logged-in User
    response.redirect("/home");
})

// Function retrieves the data of all stockcards related to the current user
async function getBienenStoecke(username){

    //retrieves the ID of the current User from the DB
    let userID = 0;
    accountConnection.query('SELECT Id from accounts WHERE username = ?', [username], function(error, results, fields){
        userID = parseInt(results[0]['Id']);

    })
    await delay(0.01);

    // retrieves all data related to the userID
    let UsersBienenStoecke =  [];
    await accountConnection.query('SELECT * from bienenstoecke WHERE FKaccountID = ?', [userID], function (error, result, fields){
        for(let i = 0; i < result.length; i++) {
            let BienenStock = {
                StockId         : result[i]['StockId'],
                Namen           : result[i]['Namen'],
                Koenigin        : result[i]['Koenigin'],
                Staerke         : result[i]['Volkssaerke'],
                Futter          : result[i]['Futter'],
                HonigEntnommen  : result[i]['HonigEntnommen'],
                Wabensitz       : result[i]['Wabensitz'],
                ErstellDatum    : result[i]['ErstellDatum']
            }
            BienenStock.ErstellDatum = BienenStock.ErstellDatum.toISOString().slice(0,10);
            UsersBienenStoecke.push(BienenStock);
        };
    });
    return UsersBienenStoecke;
}

// Function that delays the execution of the js code by set seconds
const delay = seconds => {
    return new Promise (
        resolve => setTimeout (resolve, seconds * 1000)
    )
};

// http://localhost:3000/home
// Home Page returns a view of the Index page with the username and all related stockcards
app.get('/home', async function (request, response) {
    if (request.session.loggedin) {
        let  BienenStoecke = await getBienenStoecke(request.session.username);
        await delay(0.01);
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

// clears all session-variables and redirects to the login/register page
app.get('/Logout', function(request, response){
    request.session.loggedin = false;
    request.session.username = "";
    console.log("User is logged out")
    response.redirect("/");
})

// inserts a new plain stockcard to the DB with a timestamp of calling this method
// after that redirects back to /home
app.get('/addCard', async function(request, response){
    let userID = 0;
    accountConnection.query('SELECT Id from accounts WHERE username = ?', [request.session.username], function(error, results, fields){
        userID = parseInt(results[0]['Id']);

    })
    await delay(0.05);
    let Values = [[
        " ",
        " ",
        0,
        0,
        0,
        0,
        userID,
        new Date().toISOString().slice(0, 19).replace('T', ' ')]]
    accountConnection.query('INSERT INTO bienenstoecke (Namen, Koenigin, Volkssaerke, Futter, HonigEntnommen, Wabensitz, FKaccountID, ErstellDatum) VALUES?', [Values])
    await delay(0.05);
    console.log('Datum ');
    console.log(request.query.ErstellDatum);
    response.redirect('/home');

})

// updates the values of a card in the DB
app.post('/addCard', async function (request, response){

    let query = `UPDATE bienenstoecke SET Namen = "${request.body.Namen}", Koenigin = "${request.body.Koenigin}", Volkssaerke = "${request.body.Staerke}", Futter = "${request.body.Futter}", HonigEntnommen = "${request.body.HonigEntnommen}",  Wabensitz = "${request.body.Wabensitz}" WHERE StockId = "${request.body.StockId}"`;
    console.log("Values of new Card")
    console.log(query);
    accountConnection.query(query);
    await delay(0.05);
    response.redirect('/home');
})


// deletes the card with the specific StockID
app.post('/delCard', async function(request, response){
    accountConnection.query(`DELETE from bienenstoecke where StockId = "${request.body.StockId}";`);
    await delay(0.05);
    response.redirect('/home');
})

// http://localhost:3000/todo
// returns the view of the todopage
app.get('/todo', function(request, response){
    if(request.session.loggedin) {
        response.render('todo',{
            username: request.session.username});
    }else{
        response.redirect('/');
    }
})


// http://localhost:3000/map
// returns the view of the mappage
app.get('/map', function(request, response){
    if(request.session.loggedin) {
        response.render('map', {
            username: request.session.username
        });

    }else{
        response.redirect('/');
    }
})



app.listen(3000);