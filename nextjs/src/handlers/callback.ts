import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { consentCors } from '../lib/consent'
import config from '../lib/config'
import { getOidc, clearOidcCookie } from '../lib/oidc'
import { fetchToken, parseToken, wildcardConsole, Claims } from '@hellocoop/utils'
import { saveAuthCookie, Auth } from '../lib/auth'
import { Scope } from '@hellocoop/utils'

// import type { HelloClaims, User } from '../lib/user'



const handleCallback = async (req: NextApiRequest, res: NextApiResponse) => {
    await consentCors(req, res)
    const {
        code,
        error,
        wildcard_domain,
        app_name,
    } = req.query

    const oidcState = await getOidc(req,res)

    if (!oidcState)
        return res.status(400).end('OpenID Connect cookie lost')
    if (error)
        return res.status(400).end(error)
    if (!code)
        return res.status(400).end('Missing code parameter')
    if (Array.isArray(code))
        return res.status(400).end('Received more than one code.')

    const {
        code_verifier,
        nonce,
        redirect_uri,
        target_uri
    } = oidcState

    if (!code_verifier) {
        res.status(400).end('Missing code_verifier from session')
        return
    }

    try {
        const token = await fetchToken({
            code: code.toString(),
            wallet: config.helloWallet,
            code_verifier,
            redirect_uri,
            client_id: config.clientId as string 
        })

        const { payload } = await parseToken(token)

        if (payload.aud != config.clientId) {
            return res.status(400).end('Wrong ID token audience.')
        }
        if (payload.nonce != nonce) {
            return res.status(400).end('Wrong nonce in ID token.')
        }
        
        const currentTimeInt = Math.floor(Date.now()/1000)
        if (payload.exp < currentTimeInt) {
            return res.status(400).end('The ID token has expired.')
        }
        if (payload.iat > currentTimeInt+5) { // 5 seconds of clock skew
            return res.status(400).end('The ID token is not yet valid.')
        }

        // TBD == pull out key claims

        const auth: Auth = {
            isLoggedIn: true,
            sub: payload.sub,
            iat: payload.iat
        }
        // hack TypeScript
        const claims: {[key: string]: any} = payload as {[key: string]: any}
        payload.scope.forEach( (scope) => {
            const claim = claims[scope]
            if (claim)
                auth[scope] = claim
        })
        await saveAuthCookie( res, auth)
    } catch (error: any) {
        clearOidcCookie(res)
        return res.status(500).end(error.message)
    }

    if (wildcard_domain) { 
        // the redirect_uri is not registered at Hellō - prompt to add
        const appName = (Array.isArray(app_name) ? app_name[0] : app_name)  || 'Your App'
        res.end(wildcardConsole({
            uri: Array.isArray(wildcard_domain) ? wildcard_domain[0] : wildcard_domain,
            appName,
            redirectURI: redirect_uri,
            targetURI: target_uri
        }))
        return
    }

    res.redirect(target_uri 
        || '/') // just in case
}

export default handleCallback