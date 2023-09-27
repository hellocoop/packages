import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'

import * as config from '../lib/config'

const handleLogout = async (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy()

    // TODO - look for URL to goto after log out

console.log('Logout called')

    res.redirect('/')
}
// wrap handler
export default withIronSessionApiRoute( handleLogout, config.sessionOptions)

