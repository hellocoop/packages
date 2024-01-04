// test server
import express, { Request, Response } from 'express'
import { helloAuth, HelloConfig} from '@hellocoop/express'
import { redirect, unauthorized, setAuth } from '@hellocoop/express'

const config: HelloConfig = require('../hello.config.js')

const app = express();
const port = 8080; // default port to listen

app.use(helloAuth(config))

app.get( "/", async ( req: Request, res: Response ) => {
    res.json( await req.getAuth()) 
} );

app.get( "/redirect", redirect('/'), async ( req: Request, res: Response ) => {
    res.json( await req.getAuth()) 
} );

app.get( "/unauthorized", unauthorized, async ( req: Request, res: Response ) => {
    res.json( await req.getAuth()) 
} );

app.get( "/setAuth", setAuth, ( req: Request, res: Response ) => {
    res.json( req.auth) 
} );


// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );