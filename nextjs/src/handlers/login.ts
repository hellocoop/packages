import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { sealData } from 'iron-session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { randomUUID as uuidv4 } from 'crypto'

import { consentBaseUrl } from '../lib/consent'
import { buildQuickstartUrl } from '../lib/quickstart'
import type { Config } from '../lib/config'

const handleLoginFactory = (config: Config): NextApiHandler =>
    withIronSessionApiRoute(async (req: NextApiRequest, res: NextApiResponse) => {
        const { sourceRoute, updateProfile } = req.query

        if (!config.baseUrl) {
            res.status(500).end('Missing baseUrl configuration')
            return
        }
        if (config.enableQuickstart && !config.helloClientId) {
            res.redirect(buildQuickstartUrl(config).toString())
            return
        }
        if (!config.helloClientId) {
            res.status(500).end('Missing helloClientId configuration')
            return
        }

        const nonce = uuidv4()
        req.session.nonce = nonce
        req.session.sourceRoute = Array.isArray(sourceRoute) ? sourceRoute[0] : sourceRoute
        await req.session.save()
        const state = await sealData({
            nonce,
            sourceRoute: Array.isArray(sourceRoute) ? sourceRoute[0] : sourceRoute
        }, config.sessionOptions)

        const baseUrl = new URL(config.baseUrl)
        const callbackUrl = new URL(config.callbackRoute, baseUrl)

        const scope = (config.helloScopes.concat(updateProfile === true.toString()
            ? ['profile_update']
            : [])).join(' ')

        const consentUrl = new URL(consentBaseUrl)
        consentUrl.searchParams.append('client_id', config.helloClientId)
        consentUrl.searchParams.append('redirect_uri', callbackUrl.toString())
        consentUrl.searchParams.append('scope', scope)
        consentUrl.searchParams.append('nonce', nonce)
        consentUrl.searchParams.append('state', state)
        consentUrl.searchParams.append('response_type', 'id_token')
        consentUrl.searchParams.append('response_mode', 'form_post')

        res.redirect(consentUrl.toString())
    }, config.sessionOptions)

export default handleLoginFactory
