const Fastify = require('fastify')
const helloAuth = require('../dist').helloAuth
const config = require('../hello.config')

const app = () => {
    const fastify = Fastify()
    fastify.register(helloAuth, config)
    return fastify
}

module.exports = app