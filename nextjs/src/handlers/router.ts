import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import config from '../lib/config'
import handleCallback from './callback'
import handleLogin from './login'
import handleLogout from './logout'
import { handleAuth } from './auth'
import { NotLoggedIn } from '../lib/auth'

const  translateHandlerErrors = (handler: NextApiHandler): NextApiHandler =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await handler(req, res)
        } catch (error: any) {
            console.error(error)
            res.status(error?.status || 500).end(error.message)
        }
    }     

// console.log('config\n',JSON.stringify(config,null,4))   

const router = translateHandlerErrors((req: NextApiRequest, res: NextApiResponse) => {
        const { query } = req

// console.log({query})     

        if (query.auth || query.getAuth) { // get auth object
            if (config.error) // don't blow up buttons if not configured
                return res.end(NotLoggedIn)    
            else 
                return handleAuth(req, res) 
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

        if (query.iss) {        // IdP (Hellō) initiated login
            // https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin
            throw new Error('unimplemented')
        }


        res.status(500).end('Invalid hellocoop call:\n'+JSON.stringify(query,null,4))
    })

export default router