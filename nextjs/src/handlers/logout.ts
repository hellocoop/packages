import { NextApiRequest, NextApiResponse } from 'next'

import config from '../lib/config'

const handleLogout = async (req: NextApiRequest, res: NextApiResponse) => {
    const { target_uri } = req.query
    // TODO delete cookies
    res.redirect(target_uri as string || config.routes.loggedOut) 
}

export default handleLogout

