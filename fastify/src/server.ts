// test server

// import fastly from 'fastify'
// import auth from './index'
// import { redirect, unauthorized, setAuth } from './middleware'

// const app = fastly();
// const port = 8080; // default port to listen

// app.register(auth,{client_id:'90804992-8d01-474e-8a0c-59cddeb5a1a3'})

// app.get( "/", async ( req, res ) => {
//     res.send( await req.getAuth()) 
// } );

// app.get( "/redirect", redirect('/'), async ( req, res ) => {
//     res.send( await req.getAuth()) 
// } );

// app.get( "/unauthorized", unauthorized, async ( req, res ) => {
//     res.send( await req.getAuth()) 
// } );

// app.get( "/setAuth", setAuth, ( req, res ) => {
//     res.send( req.auth) 
// } );


// // start the Express server
// app.listen( port, () => {
//     console.log( `server started at http://localhost:${ port }` );
// } );

import fastify from 'fastify'
import {helloAuth, HelloConfig} from './index'
import { redirect, unauthorized, setAuth } from './middleware'

const config: HelloConfig = require('../hello.config.js')

const app = fastify();
const port = 8080;

// Register your auth plugin with Fastify
app.register(helloAuth, config)

// Define your routes, using preHandler hooks to replace Express middleware
app.get("/", async (request, reply) => {
    const auth = await request.getAuth();
    return reply.send(auth);
});

app.get("/redirect", {
    preHandler: redirect('/'),
    handler: async (request, reply) => {
        const auth = await request.getAuth();
        return reply.send(auth);
    }
});

app.get("/unauthorized", {
    preHandler: unauthorized,
    handler: async (request, reply) => {
        const auth = await request.getAuth();
        return reply.send(auth);
    }
});

app.get("/setAuth", {
    preHandler: setAuth,
    handler: async (request, reply) => {
        // Assuming setAuth sets something like request.auth
        return reply.send(request.auth);
    }
});

const startServer = async () => {
    try {
        await app.listen({port: port})
        console.log(`Server started at http://localhost:${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
