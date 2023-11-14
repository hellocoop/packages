
import { Request, Response } from 'express'
import { wildcardConsole } from '@hellocoop/core'

const handleCallback = async (req: Request, res: Response) => {
    res.end(wildcardConsole(req.query as { uri:string, appName:string, redirectURI:string, targetURI:string }))
}
export default handleCallback
    