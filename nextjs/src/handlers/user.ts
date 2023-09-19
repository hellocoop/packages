import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'

import type { Config } from '../lib/config'
import type { User } from '../lib/user'

const handleUserFactory = (config: Config) =>
    withIronSessionApiRoute(async (req: NextApiRequest, res: NextApiResponse<User>) => {
        if (req.session.user?.isLoggedIn) {
            res.json({
                ...req.session.user,
                isLoggedIn: true
            })
        } else {
            res.json({
                isLoggedIn: false
            })
        }
    }, config.sessionOptions)

export default handleUserFactory
