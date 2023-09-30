import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { createAuthRequest, redirectURIBounce, ICreateAuthRequest, Scope, ProviderHint } from '@hellocoop/utils'
import * as config from '../lib/config'

var redirectURI:string | null = null // set dynamically if not configured

var callCount = 0 // DEBUG

const handleLogin = async (req: NextApiRequest, res: NextApiResponse) => {
    const { provider_hint: providerParam, scope: scopeParam, target_uri, redirect_uri } = req.query

    if (!config.clientId) {
        res.status(500).end('Missing HELLO_CLIENT_ID configuration')
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
    // parse out param strings
    const targetURIstring = Array.isArray(providerParam) ? providerParam[0] : providerParam
    const provider_hint = targetURIstring?.split(' ').map((s) => s.trim()) as ProviderHint[] | undefined
    const scopeString = Array.isArray(scopeParam) ? scopeParam[0] : scopeParam
    const scope = scopeString?.split(' ').map((s) => s.trim()) as Scope[] | undefined

    const request: ICreateAuthRequest = {
        redirect_uri: redirectURI,
        client_id: config.clientId,
        wallet: config.helloWallet,
        scope,
        provider_hint
    }
    const { url, nonce, code_verifier } = await createAuthRequest(request)
    req.session.oidc = {
        nonce,
        code_verifier,
        redirect_uri: redirectURI,
        target_uri: (Array.isArray(target_uri) ? target_uri[0] : target_uri)|| config.defaultTargetRoute
    }

    await req.session.save()
    res.redirect(url)
}
// wrap handler
export default withIronSessionApiRoute( handleLogin, config.sessionOptions)
