import { HelloRequest, HelloResponse } from '../types'

import config from '../lib/config'
import handleCallback from './callback'
import handleLogin from './login'
import handleLogout from './logout'
import { handleAuth, handleCookieTokenVerify } from './auth'
import handleWildcardConsole from './wildcard'
import { NotLoggedIn } from '@hellocoop/constants'

// const  translateHandlerErrors = (handler: Router): Router =>
//     async (req: HelloRequest, res: HelloResponse, next: NextFunction) => {
//         try {
//             await handler(req, res, next)
//             next()
//         } catch (error: any) {
//             console.error(error)
//             res.status(error?.status || 500).send(error.message)
//         }
//     }     

// // console.log('config\n',JSON.stringify(config,null,4))   

// const router = translateHandlerErrors((req: HelloRequest, res: HelloResponse, next: NextFunction ) => {
//         const { query } = req

// // console.log({query})     

const router = (req: HelloRequest, res: HelloResponse ) => {
    const { query, method } = req

    if (!query) {
        res.status(500)
        res.send('Missing query')
        return
    }
    if (method === 'POST') {
        if (query.op === 'verifyCookieToken') {
            return handleCookieTokenVerify(req, res)
        }
        return res.status(400).send('Invalid op parameter')
    }
    if (method !== 'GET')
        return res.status(400).send('Method not allowed')
    if (query.op) { // not a protocol flow
        if (query.op === 'auth' || query.op === 'getAuth') {
            if (config.error) {
                return res.json(NotLoggedIn)    
            } else {
                return handleAuth(req, res)                 
            } 
        }
        if (query.op === 'login') { // start login flow, redirect to Hellō
            return handleLogin(req, res)
        }
        if (query.op === 'logout') {     // logout user
            return handleLogout(req, res)
        }
        res.status(500)
        res.send('unknown op parameter:\n'+JSON.stringify(query,null,4))        
        return
    }
    if (config.error) { // not able to process requests
        res.status(500)
        res.send('Missing configuration:\n'+JSON.stringify(config.error,null,4))
        return
    }

    if (query.code || query.error) { // authorization response
        return handleCallback(req, res)
    }

    if (query.wildcard_console) {
        return handleWildcardConsole(req, res)
    }

    if (query.iss) {        // IdP (Hellō) initiated login
        // https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin
        throw new Error('unimplemented')
    }

    res.status(500)
    res.send('unknown query:\n'+JSON.stringify(query,null,4))
}

export default router