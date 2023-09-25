import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import type { Config } from '../lib/config'

const translateHandlerErrors = (handler: NextApiHandler): NextApiHandler =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await handler(req, res)
        } catch (error: any) {
            console.error(error)
            res.status(error?.status || 500).end(error.message)
        }
    }

interface Handlers {
    handleLogin: NextApiHandler,
    handleLogout: NextApiHandler,
    handleCallback: NextApiHandler,
    handleUser: NextApiHandler
}

const handleAuthFactory = (handlers: Handlers, config: Config) =>
    translateHandlerErrors((req: NextApiRequest, res: NextApiResponse) => {
        let { query: { hello: route } } = req

        route = Array.isArray(route) ? route[0] : route

// console.log('config\n',JSON.stringify(config,null,4))        

        if (!config.sessionOptions.password) {
            res.status(500).end('Missing HELLOCOOP_SESSION_SECRET configuration')
            return
        }

        if (!config.clientId) {
            res.status(500).end('Missing HELLOCOOP_CLIENT_ID configuration')
            return
        }        

        if (req.query.code || req.query.error) { // authorization response
            return handlers.handleCallback(req, res)
        }

        if (req.query.logout) {     // logout user
            return handlers.handleLogout(req, res)
        }

        if (req.query.iss) {        // IdP (Hellō) initiated login
            // https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin
            throw new Error('unimplmented')
        }

        if (req.query.profile) {
            return handlers.handleUser(req, res)
        }

        if (req.query.login) {
            return handlers.handleLogin(req, res)
        }
        res.status(500).end('Invalid hellocoop call:\n'+JSON.stringify(req.query,null,4))

    })

export default handleAuthFactory
