import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'

import type { Config } from '../lib/config'

const handleLogoutFactory = (config: Config): NextApiHandler =>
    withIronSessionApiRoute((req: NextApiRequest, res: NextApiResponse) => {
        req.session.destroy()

        if (!config.baseUrl) {
            res.status(500).end('Missing baseUrl configuration')
            return
        }

        const baseUrl = new URL(config.baseUrl)
        res.redirect(baseUrl.toString())
    }, config.sessionOptions)

export default handleLogoutFactory
