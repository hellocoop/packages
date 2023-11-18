import { HelloRequest, HelloResponse } from '../types'

import config from '../lib/config'
import handleCallback from './callback'
import handleLogin from './login'
import handleLogout from './logout'
import { handleAuth } from './auth'
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
    const { query } = req

    if (!query) {
        res.status(500)
        res.send('Missing query')
        return
    }

    if (query.auth || query.getAuth) { // get auth object
        if (config.error) {
            return res.json(NotLoggedIn)    
        } else {
            return handleAuth(req, res)                 
        } 
    }

    if (config.error) { // not able to process requests
        res.status(500)
        res.send('Missing configuration:\n'+JSON.stringify(config.error,null,4))
        return
    }

    if (query.login) { // start login flow, redirect to Hellō
        return handleLogin(req, res)
    }

    if (query.code || query.error) { // authorization response
        return handleCallback(req, res)
    }

    if (query.logout) {     // logout user
        return handleLogout(req, res)
    }

    if (query.wildcard_console) {
        return handleWildcardConsole(req, res)
    }

    if (query.iss) {        // IdP (Hellō) initiated login
        // https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin
        throw new Error('unimplemented')
    }


    res.status(500)
    res.send('Invalid hellocoop call:\n'+JSON.stringify(query,null,4))
}

export default router