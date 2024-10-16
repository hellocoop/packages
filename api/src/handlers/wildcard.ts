
import { HelloRequest, HelloResponse } from '../types'
import { wildcardConsole } from '@hellocoop/core'

const handleCallback = async (req: HelloRequest, res: HelloResponse) => {
    res.send(wildcardConsole(req.query as { uri:string, appName:string, redirectURI:string, targetURI:string }))
}
export default handleCallback
    