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

        if (!config.sessionSecret) {
            res.status(500).end('Missing sessionSecret configuration')
            return
        }

        switch (route) {
            case 'login':
                return handlers.handleLogin(req, res)
            case 'logout':
                return handlers.handleLogout(req, res)
            case 'callback':
                return handlers.handleCallback(req, res)
            case 'me':
                return handlers.handleUser(req, res)
            default:
                res.status(404).end()
        }
    })

export default handleAuthFactory
