import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { unsealData } from 'iron-session'
import { withIronSessionApiRoute } from 'iron-session/next'

import { consentCors, consentBaseUrl } from '../lib/consent'
import type { Config } from '../lib/config'
import type { HelloClaims, User } from '../lib/user'

const handleCallbackFactory = (config: Config): NextApiHandler =>
    withIronSessionApiRoute(async (req: NextApiRequest, res: NextApiResponse) => {
        await consentCors(req, res)

        let sourceRoute = ''

        if (!config.baseUrl) {
            res.status(500).end('Missing baseUrl configuration')
            return
        }
        if (!config.helloClientId) {
            res.status(500).end('Missing helloClientId configuration')
            return
        }

        if (!req.session.user?.isLoggedIn) {
            const {
                id_token: idToken,
                state,
                error
            } = req.body

            if (error) {
                res.status(400).end(error)
                return
            }

            if (!idToken) {
                res.status(400).end('Missing id_token parameter')
                return
            }

            if (!state) {
                res.status(400).end('Missing state')
                return
            }

            const unsealedState: Record<string, string> = await unsealData(state, config.sessionOptions)
            const { nonce } = unsealedState
            sourceRoute = unsealedState.sourceRoute

            try {
                const claims: HelloClaims = await fetch(
                    new URL('/oauth/introspect', consentBaseUrl).toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `id_token=${idToken}&nonce=${nonce}&client_id=${config.helloClientId}`
                }).then((r) => r.json())

                const user: User = {
                    isLoggedIn: true,
                    ...claims
                }

                req.session.user = user
                await req.session.save()
            } catch (error: any) {
                res.status(500).end(error.message)
            }
        }

        const baseUrl = new URL(config.baseUrl)
        const dangerousReturnTo = sourceRoute || config.defaultReturnToRoute
        let safeReturnTo: URL
        try {
            safeReturnTo = new URL(dangerousReturnTo, baseUrl)
            if (safeReturnTo.origin === baseUrl.origin) {
                res.redirect(303, safeReturnTo.toString())
                return
            }
        } catch (e) {
        }

        res.redirect(303, new URL(config.defaultReturnToRoute, baseUrl).toString())
    }, config.sessionOptions)

export default handleCallbackFactory
