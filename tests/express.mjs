// test server
import express from 'express'
import { helloAuth } from '@hellocoop/express'
import { redirect, unauthorized, setAuth } from '@hellocoop/express'

import config from './hello.config'

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
