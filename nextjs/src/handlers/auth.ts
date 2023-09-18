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
    // handleUser: NextApiHandler
}

const handleAuthFactory = (handlers: Handlers, config: Config) =>
    translateHandlerErrors((req: NextApiRequest, res: NextApiResponse) => {
        let { query: { hello: route } } = req

        route = Array.isArray(route) ? route[0] : route

        if (!config.sessionSecret) {
            res.status(500).end('Missing sessionSecret configuration')
            return
        }

        if (req.method === 'POST') { // authorization response
            return handlers.handleCallback(req, res)
        }

        if (req.query.logout) {     // logout user
            return handlers.handleLogout(req, res)
        }

        if (req.query.iss) {        // IdP (Hellō) initiated login
            throw new Error('unimplmented')
        }

        return handlers.handleLogin(req, res)
    })

export default handleAuthFactory
