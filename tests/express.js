// test server
const express =  require('express')
const { helloAuth, redirect, unauthorized, setAuth } = require('@hellocoop/express')
const config =  require('./hello.config')

const app = express();
const port = 8080; // default port to listen

app.use(helloAuth(config))

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


// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
