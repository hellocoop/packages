import Cors from 'cors'

import initMiddleware from './init-middleware'
import config from './config'
const allowedOrigin = config.helloWallet

export const consentCors = initMiddleware(
    Cors({
        methods: ['POST', 'OPTIONS'],
        origin: allowedOrigin
    })
)
