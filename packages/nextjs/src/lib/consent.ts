import Cors from 'cors'

import initMiddleware from './init-middleware'

export const consentBaseUrl = new URL('https://wallet.hello.coop')

export const consentCors = initMiddleware(
    Cors({
        methods: ['POST', 'OPTIONS'],
        origin: consentBaseUrl.origin
    })
)
