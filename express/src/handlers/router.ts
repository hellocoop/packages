import { Request, Response } from 'express'

import config from '../lib/config'
import handleCallback from './callback'
import handleLogin from './login'
import handleLogout from './logout'
import handleWildcardConsole from './wildcard'

import { handleAuth } from './auth'
import { NotLoggedIn } from '../lib/auth'

// const  translateHandlerErrors = (handler: Router): Router =>
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await handler(req, res, next)
//             next()
//         } catch (error: any) {
//             console.error(error)
//             res.status(error?.status || 500).end(error.message)
//         }
//     }     

// // console.log('config\n',JSON.stringify(config,null,4))   

// const router = translateHandlerErrors((req: Request, res: Response, next: NextFunction ) => {
//         const { query } = req

// // console.log({query})     

const router = (req: Request, res: Response ) => {
    const { query } = req

    if (query.auth || query.getAuth) { // get auth object
        if (config.error) {
            return res.end(NotLoggedIn)    
        } else {
            return handleAuth(req, res)                 
        } 
    }

    if (config.error) // not able to process requests
        return res.status(500).end('Missing configuration:\n'+JSON.stringify(config.error,null,4))

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


    res.status(500).end('Invalid hellocoop call:\n'+JSON.stringify(query,null,4))
}

export default router