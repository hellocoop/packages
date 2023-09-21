import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'

import type { Config } from '../lib/config'

const handleLogoutFactory = (config: Config): NextApiHandler =>
    withIronSessionApiRoute((req: NextApiRequest, res: NextApiResponse) => {
        req.session.destroy()

        // TODO - look for URL to goto after log out

console.log('Logout called')

        res.redirect('/')
    }, config.sessionOptions)

export default handleLogoutFactory
