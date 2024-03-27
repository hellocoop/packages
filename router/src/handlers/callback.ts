import { HelloRequest, HelloResponse, CallbackRequest, CallbackResponse } from '../types'
import config from '../lib/config'
import { getOidc, clearOidcCookie } from '../lib/oidc'
import { fetchToken, parseToken, errorPage, ErrorPageParams, sameSiteCallback } from '@hellocoop/core'
import { saveAuthCookie } from '../lib/auth'
import { Auth } from '@hellocoop/types'
import { NotLoggedIn, VALID_IDENTITY_CLAIMS } from '@hellocoop/constants'


const getCallbackRequest = (req: HelloRequest): CallbackRequest => {
    return {
        getHeaders: () => { return req.headers() }
    }
}

const getCallbackResponse = (res: HelloResponse): CallbackResponse => {
    return {
        setHeader: (key: string, value: string) => { res.setHeader(key, value) },
        setCookie: (key: string, value: string, options: any) => { res.setCookie(key, value, options) },
    }
}


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

    if (config.sameSiteStrict && !same_site) // we need to bounce so we get cookies
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

        VALID_IDENTITY_CLAIMS.forEach( (claim) => {
            const value = (payload as any)[claim]
            if (value)
                (auth as any)[claim] = value
        })
        auth = auth as Auth
        if (config?.loginSync) {
            try {
                const cbReq = getCallbackRequest(req)
                const cbRes = getCallbackResponse(res)
                const cb = await config.loginSync({ token, payload, cbReq, cbRes })
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

        if (wildcard_domain) { 
            // the redirect_uri is not registered at Hellō - prompt to add
            const appName = (Array.isArray(app_name) ? app_name[0] : app_name)  || 'Your App'

            const queryString = new URLSearchParams({
                uri: Array.isArray(wildcard_domain) ? wildcard_domain[0] : wildcard_domain,
                appName,
                redirectURI: redirect_uri,
                targetURI: target_uri,
                wildcard_console: 'true'
            }).toString()

            target_uri = config.apiRoute+'?'+queryString
        }

        await saveAuthCookie( res, auth)
        if (config.sameSiteStrict)
            res.json({target_uri})
        else 
            res.redirect(target_uri)
    } catch (error: any) {
        clearOidcCookie(res)
        return res.status(500).send(error.message)
    }

}

export default handleCallback