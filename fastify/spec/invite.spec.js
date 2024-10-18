// const { expect } = require('chai')
// const Fastify = require('./fastify')

// describe('Invite', async () => {
//     let fastify = null

//     before( async () => {
//         fastify = await Fastify().ready()
//     })

//     it('Login', async () => {
//         const response = await fastify.inject({
//             method: 'GET',
//             url: '/api/hellocoop?op=login'
//         })
//         expect(response.statusCode).to.eql(200)
//         console.log(response.body)
//     })

    // it('Call ?op=invite', async () => {
    //     const response = await fastify.inject({
    //         method: 'GET',
    //         url: '/api/hellocoop?op=invite&app_name=Test'
    //     })
    //     expect(response.statusCode).to.eql(200)
    // })

    
    // it('Redirect to authorize app with correct params', async () => {})
// })