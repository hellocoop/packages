import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { createAuthRequest, redirectURIBounce } from '@hellocoop/utils'
import * as config from '../lib/config'

var redirectURI:string | null = null // set dynamically if not configured

var callCount = 0 // DEBUG

const handleLogin = async (req: NextApiRequest, res: NextApiResponse) => {
    const { target_uri, scope, redirect_uri } = req.query

    if (!config.clientId) {
        res.status(500).end('Missing HELLOCOOP_CLIENT_ID configuration')
        return
    }

callCount++
console.log('login called:',callCount)

    if (config.redirectURI)
        redirectURI = config.redirectURI

    if (!redirectURI) {
        if (!redirect_uri) {
            console.log('Discovering API route ...')
            return res.end(redirectURIBounce())        
        } else {
            redirectURI = redirect_uri as string
            console.log('We have now set redirectURI to:',redirectURI)
        }
   }

    const { url, nonce, code_verifier } = await createAuthRequest({
        redirect_uri: redirectURI,
        client_id: config.clientId
        // TODO -- pass in scope from environment / config or passed in call
    })
    req.session.oidc = {
        nonce,
        code_verifier,
        redirect_uri: redirectURI
    }

    await req.session.save()
    res.redirect(url)
}
// wrap handler
export default withIronSessionApiRoute( handleLogin, config.sessionOptions)
