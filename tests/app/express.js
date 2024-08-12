/*
* test server
*
* We use this server to test the @hellocoop/express package
*
* We use a self signed certificate to test https cookies
* and also because Chrome upgrades http to https when using "app" as the host
*/



// test server
const express = require('express');
const https = require('https');
const fs = require('fs');
const { helloAuth, redirect, unauthorized, setAuth } = require('@hellocoop/express');
const config = require('./hello.config');

const app = express();
const port = 8080; // default port to listen

// SSL certificate setup
const privateKey = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// // simple logging
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
//     next();
// });

app.use(helloAuth(config));

app.get( "/", async ( req, res ) => {
    res.json( await req.getAuth()) 
} );

app.get( "/redirect", redirect('/'), async ( req, res ) => {
    res.json( await req.getAuth()) 
} );

app.get( "/unauthorized", unauthorized, async ( req, res ) => {
    res.json( await req.getAuth()) 
} );

app.get( "/setAuth", setAuth, ( req, res ) => {
    res.json( req.auth) 
} );
// Create HTTPS server
https.createServer(credentials, app).listen(port, () => {
    console.log(`HTTPS server listening on port:${port}`);
});
