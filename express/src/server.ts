// test server
import express, { Request, Response } from 'express'
import auth from './index'
const app = express();
const port = 8080; // default port to listen

console.log('server.ts:',process.cwd())


app.use(auth({client_id:'90804992-8d01-474e-8a0c-59cddeb5a1a3'}))

// define a route handler for the default home page
app.get( "/", ( req: Request, res: Response ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
