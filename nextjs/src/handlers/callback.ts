import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { unsealData } from 'iron-session'
import { withIronSessionApiRoute } from 'iron-session/next'

import { consentCors, consentBaseUrl } from '../lib/consent'
import type { Config } from '../lib/config'
import { fetchToken } from '@hellocoop/utils'
// import type { HelloClaims, User } from '../lib/user'

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

        const {
            code,
            error
        } = req.query


        if (error) {
            res.status(400).end(error)
            return
        }

        if (!code) {
            res.status(400).end('Missing code parameter')
            return
        }
        if (Array.isArray(code)) {
            res.status(400).end('Received more than one code.')
        }

        const code_verifier = req.session.oidc?.code_verifier

        if (!code_verifier) {
            res.status(400).end('Missing code_verifier from session')
            return
        }

        try {
            const payload = await fetchToken({
                code: code.toString(),
                code_verifier,
                redirect_uri: config.baseUrl,
                client_id: config.helloClientId    
            })
            // save user to session
            // await req.session.save()
            req.session.user = {
                ...payload,
                isLoggedIn: true 
            }
            await req.session.save()


    console.log(JSON.stringify(payload, null, 4));

        } catch (error: any) {
            return res.status(500).end(error.message)
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
