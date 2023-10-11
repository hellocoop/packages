import { NextApiRequest, NextApiResponse } from 'next'
import { clearAuthCookie } from '../lib/auth'
import config from '../lib/config'

const handleLogout = async (req: NextApiRequest, res: NextApiResponse) => {
    const { target_uri } = req.query
    await clearAuthCookie(res)
    res.redirect(target_uri as string || config.routes.loggedOut) 
}

export default handleLogout

