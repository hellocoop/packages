
import { NextApiRequest, NextApiResponse } from 'next'
import { wildcardConsole } from '@hellocoop/core'

const handleCallback = async (req: NextApiRequest, res: NextApiResponse) => {
    res.end(wildcardConsole(req.query as { uri:string, appName:string, redirectURI:string, targetURI:string }))
}
export default handleCallback
