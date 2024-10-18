const { expect } = require('chai')
const app = require('./app-setup')

//tbd: seperate test if no redirect uri is set - auto discovery

describe('Invite', async () => {
    let fastify = null

    before( async () => {
        fastify = await app().ready()
    })

    it('Login', async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: '/api/hellocoop?op=login'
        })
        expect(response.statusCode).to.eql(200)
        console.log(response.body)
    })

    // it('Call ?op=invite', async () => {
    //     const response = await fastify.inject({
    //         method: 'GET',
    //         url: '/api/hellocoop?op=invite&app_name=Test'
    //     })
    //     expect(response.statusCode).to.eql(200)
    // })

    
    // it('Redirect to invite app with correct invite params', async () => {})
})