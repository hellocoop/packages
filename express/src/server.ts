// test server
import express, { Request, Response } from 'express'
import auth from './index'
import { redirect, unauthorized, setAuth } from './middleware'

const app = express();
const port = 8080; // default port to listen

app.use(auth({client_id:'90804992-8d01-474e-8a0c-59cddeb5a1a3'}))

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
