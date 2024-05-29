const express = require('express');
const session = require("express-session");
const Keycloak = require("keycloak-connect");

const app = express();
const PORT = 3000;

/** 
 * 
 * Keyclock middleware setup - START 
 * 
 * */
const USER_ROLE = process.env.USER_ROLE || 'express-user';
const ADMIN_ROLE = process.env.ADMIN_ROLE || 'express-admin';

const kcConfig = {
    clientId: process.env.AUTH_CLIENT_ID || 'secure-express-service',
    bearerOnly: true,
    serverUrl: process.env.AUTH_SERVER || 'http://localhost:8080',
    realm: process.env.AUTH_REALM || 'master'
};

const memoryStore = new session.MemoryStore();

Keycloak.prototype.accessDenied = function (request, response) {
    response.status(401)
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ status: 401, message: 'Unauthorized/Forbidden', result: { errorCode: 'ERR-401', errorMessage: 'Unauthorized/Forbidden' } }))
}

const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

function adminOnly(token, request) {
    return token.hasRole(`realm:${ADMIN_ROLE}`);
}

function isAuthenticated(token, request) {
    return token.hasRole(`realm:${ADMIN_ROLE}`) || token.hasRole(`realm:${USER_ROLE}`);
}

app.use(session({
    secret: process.env.APP_SECRET || 'BV&%R*BD66JH',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
  
app.use( keycloak.middleware() );

/** Keyclock middleware setup - END */




/**
 * 
 * REST Endpoints
 * 
 */
app.get('/public', (req, res) => {
    res.status(200).send({
        'message': "This is a public enpoint which can be accessed by anonymous users",
    });
})

app.get('/secured', [keycloak.protect(isAuthenticated)], (req, res) => {
    res.status(200).send({
        'message': "This is a secured enpoint which can be accessed by any authenticated user",
    });
})

app.get('/secured-admin', [keycloak.protect(adminOnly)], (req, res) => {
    res.status(200).send({
        'message': "This is a secured enpoint which can be accessed only by any authenticated user with role admin",
    });
})

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running,  and App is listening on port " + PORT)
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
}
); 