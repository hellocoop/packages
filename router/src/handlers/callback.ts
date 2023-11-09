import { HelloRequest, HelloResponse } from '../types'
import config from '../lib/config'
import { getOidc, clearOidcCookie } from '../lib/oidc'
import { fetchToken, parseToken, wildcardConsole, errorPage, ErrorPageParams, sameSiteCallback } from '@hellocoop/core'
import { saveAuthCookie } from '../lib/auth'
import { Auth, NotLoggedIn } from '@hellocoop/types'

const sendErrorPage = ( error: Record<string, any>, target_uri: string, req:HelloRequest, res:HelloResponse ) => {


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
    res.send(page)
}

const handleCallback = async (req: HelloRequest, res: HelloResponse) => {
    const {
        code,
        error,
        same_site,
        wildcard_domain,
        app_name,
    } = req.query

    if (!same_site) // we need to bounce so we get cookies
        return res.send(sameSiteCallback())

    const oidcState = await getOidc(req,res)

    if (!oidcState)
        return res.status(400).send('OpenID Connect cookie lost')

    const {
        code_verifier,
        nonce,
        redirect_uri,
    } = oidcState

    let {target_uri = '/'} = oidcState

    if (error)
        return sendErrorPage( req.query, target_uri, req, res )
    if (!code)
        return res.status(400).send('Missing code parameter')
    if (Array.isArray(code))
        return res.status(400).send('Received more than one code.')

    if (!code_verifier) {
        res.status(400).send('Missing code_verifier from session')
        return
    }

    try {
        clearOidcCookie(res) // clear cookie so we don't try to use code again
        const token = await fetchToken({
            code: code.toString(),
            wallet: config.helloWallet,
            code_verifier,
            redirect_uri,
            client_id: config.clientId as string 
        })

        const { payload } = parseToken(token)

        if (payload.aud != config.clientId) {
            return res.status(400).send('Wrong ID token audience.')
        }
        if (payload.nonce != nonce) {
            return res.status(400).send('Wrong nonce in ID token.')
        }
        
        const currentTimeInt = Math.floor(Date.now()/1000)
        if (payload.exp < currentTimeInt) {
            return res.status(400).send('The ID token has expired.')
        }
        if (payload.iat > currentTimeInt+5) { // 5 seconds of clock skew
            return res.status(400).send('The ID token is not yet valid.')
        }

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
            const appName = (Array.isArray(app_name) ? app_name[0] : app_name) as string  || 'Your App'
            res.send(wildcardConsole({
                uri: (Array.isArray(wildcard_domain) ? wildcard_domain[0] : wildcard_domain) as string,
                appName,
                redirectURI: redirect_uri,
                targetURI: target_uri
            }))
            return
            // no callback processing if wildcard
        }

        if (config.callbacks?.loggedIn) {
            try {
                const cb = await config.callbacks.loggedIn({ token, payload, req, res })
                if (cb?.accessDenied) {
                    auth = NotLoggedIn
                    // TODO? set target_uri to not logged in setting?
                }
                else if (cb?.updatedAuth) {
                    auth = {
                        ...cb.updatedAuth,
                        isLoggedIn: true,
                        sub: payload.sub,
                        iat: payload.iat
                    }
                }
                target_uri = cb?.target_uri || target_uri
            } catch(e) {
                console.error(new Error('callback faulted'))
                console.error(e)
            }
        }
        await saveAuthCookie( res, auth)
        res.json({target_uri})
    } catch (error: any) {
        clearOidcCookie(res)
        return res.status(500).send(error.message)
    }

}

export default handleCallback