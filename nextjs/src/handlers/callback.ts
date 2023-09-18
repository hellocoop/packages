import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { unsealData } from 'iron-session'
import { withIronSessionApiRoute } from 'iron-session/next'

import { consentCors, consentBaseUrl } from '../lib/consent'
import type { Config } from '../lib/config'
import type { HelloClaims, User } from '../lib/user'

const handleCallbackFactory = (config: Config): NextApiHandler =>
    withIronSessionApiRoute(async (req: NextApiRequest, res: NextApiResponse) => {
        // await consentCors(req, res)


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
                code,
                error
            } = req.body

            if (error) {
                res.status(400).end(error)
                return
            }

            if (!code) {
                res.status(400).end('Missing code parameter')
                return
            }

            const { code_verifier } = req.session
            const params: Record<string, any> = {
                code,
                code_verifier,
                client_id: config.helloClientId,
                redirect_uri: config.redirect_uri
            }
            const body = new URLSearchParams(params).toString()

            try {
                const r = await fetch ('https://wallet.hello.coop/oauth/token', { // todo - adjust to deal with mock
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body
                    }).then((r) => r.json())

                const claims: HelloClaims ={
                    iss: '',
                    aud: '',
                    nonce: '',
                    jti: '',
                    sub: '',
                    scope: [''],
                    iat: 0,
                    exp: 0                    
                }

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

        // const baseUrl = new URL(config.baseUrl)
        // const dangerousReturnTo = sourceRoute || config.defaultReturnToRoute
        // let safeReturnTo: URL
        // try {
        //     safeReturnTo = new URL(dangerousReturnTo, baseUrl)
        //     if (safeReturnTo.origin === baseUrl.origin) {
        //         res.redirect(303, safeReturnTo.toString())
        //         return
        //     }
        // } catch (e) {
        // }
        res.redirect(303, '/')

        // res.redirect(303, new URL(config.defaultReturnToRoute, baseUrl).toString())
    }, config.sessionOptions)

export default handleCallbackFactory
