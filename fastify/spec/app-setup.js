const Fastify = require('fastify')
const helloAuth = require('../dist').helloAuth
const config = require('../hello.config')
const { redirect } = require('../dist')

const config = {
    client_id: '8c3a40a9-b235-4029-8d16-c70592ca94bb',
    redirect_uri: 
}

//param - no redirect -> to test auto discovery flow
//pass in config object itself?
//have test-specific config?
//test cookies
const app = () => {
    const fastify = Fastify()
    fastify.register(helloAuth, config)
    return fastify
}

module.exports = app