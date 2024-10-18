// const { expect } = require('chai')
// const Fastify = require('./fastify')

// describe('Operations', async () => {
//     let fastify = null

//     before( async () => {
//         fastify = await Fastify().ready()
//     })

//     it('Load /api/hellocoop with iss param', async () => {
//         const response = await fastify.inject({
//             method: 'GET',
//             url: '/api/hellocoop?iss=https://issuer.hello.coop&login_hint=mailto:johnsmith@me.com'
//         })
//         expect(response.statusCode).to.eql(200)
//     })

    
//     it('Redirect to authorize app with correct params', async () => {})
// })