import { NextApiRequest, NextApiResponse } from 'next'
import { consentCors } from '../lib/consent'
import config from '../lib/config'
import { getOidc, clearOidcCookie } from '../lib/oidc'
import { fetchToken, parseToken, wildcardConsole, Scope, Claims, errorPage, ErrorPageParams } from '@hellocoop/utils'
import { saveAuthCookie, Auth, NotLoggedIn } from '../lib/auth'


const sendErrorPage = ( error: Record<string, any>, target_uri: string, req:NextApiRequest, res:NextApiResponse ) => {


    if (config.routes.error) {
        const url = new URL(config.routes.error);
        for (const key in error) {
            if (key.startsWith('error')) {
                // Append each error query parameter to the URL
                url.searchParams.append(key, error[key])
            }
        }
        return res.redirect(url.toString())
    }
    const params:ErrorPageParams = { 
        error: error.error,
        error_description: error.error_description,
        error_uri: error.error_uri,
        target_uri
    }
    const page = errorPage(params)
    res.end(page)
}

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

    const {
        code_verifier,
        nonce,
        redirect_uri,
        target_uri
    } = oidcState

    if (error)
        return sendErrorPage( req.query, target_uri, req, res )
    if (!code)
        return res.status(400).end('Missing code parameter')
    if (Array.isArray(code))
        return res.status(400).end('Received more than one code.')



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

        // let auth = NotLoggedIn
        let callbackProcessed = false

        let auth = {
            isLoggedIn: true,
            sub: payload.sub,
            iat: payload.iat
        } as Auth
        // hack TypeScript
        const claims: {[key: string]: any} = payload as {[key: string]: any}
        payload.scope.forEach( (scope) => {
            const claim = claims[scope]
            if (claim)
                auth[scope as keyof Auth] = claim
        })

        if (wildcard_domain) { 
            // the redirect_uri is not registered at Hellō - prompt to add
            await saveAuthCookie( res, auth)
            const appName = (Array.isArray(app_name) ? app_name[0] : app_name)  || 'Your App'
            res.end(wildcardConsole({
                uri: Array.isArray(wildcard_domain) ? wildcard_domain[0] : wildcard_domain,
                appName,
                redirectURI: redirect_uri,
                targetURI: target_uri
            }))
            return
            // no callback processing if wild_card
        }

        if (config.callbacks?.loggedIn) {
            try {
                const cb = await config.callbacks.loggedIn({ token, payload, req, res })
                callbackProcessed = cb?.isProcessed as boolean
                if (cb?.accessDenied)
                    auth = NotLoggedIn
                else if (cb?.updatedAuth) {
                    auth = {
                        ...cb.updatedAuth,
                        isLoggedIn: true,
                        sub: payload.sub,
                        iat: payload.iat
                    }
                }
            } catch(e) {
                console.error(new Error('callback faulted'))
                console.error(e)
            }
        }
        await saveAuthCookie( res, auth)
        if (!callbackProcessed) {
            res.redirect(target_uri 
                || '/') // just in case
        }
    } catch (error: any) {
        clearOidcCookie(res)
        return res.status(500).end(error.message)
    }

}

export default handleCallback