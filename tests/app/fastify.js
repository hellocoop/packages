/*
* test server
*
* We use this server to test the @hellocoop/fastify package
*
* We use a self signed certificate to test https cookies
* and also because Chrome upgrades http to https when using "app" as the host
*/

const fastify = require('fastify');
const fs = require('fs');
const { helloAuth, redirect, unauthorized, setAuth } = require('@hellocoop/fastify'); 
const config = require('./hello.config');

// SSL certificate setup
const privateKey = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');

// Create Fastify instance with HTTPS options
const app = fastify({
    https: {
        key: privateKey,
        cert: certificate
    }
});

const port = 8080; // default port to listen
app.register(helloAuth, config)

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
        return reply.send(request.auth);
    }
});

const startServer = async () => {
    try {
        const r = await app.listen({port, host: '0.0.0.0'})
        console.log({r})
        console.log(`HTTPS server started on port:${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();