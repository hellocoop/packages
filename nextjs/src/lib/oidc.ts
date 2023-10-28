import { NextApiRequest, NextApiResponse } from 'next'
import config, { getApiRoute } from './config'
import { serialize } from 'cookie'
import { decryptObj, encryptObj } from '@hellocoop/core'

const { cookies: { oidcName } } = config

export type OIDC = {
    code_verifier: string,
    nonce: string,
    redirect_uri: string,
    target_uri: string
}

export const getOidc = async ( req: NextApiRequest, res: NextApiResponse): Promise<OIDC | undefined> => {
    try {
        const oidcCookie = req.cookies[oidcName]
        if (!oidcCookie)
            return undefined 
        const oidc = await decryptObj( oidcCookie, config.secret as string) as OIDC | undefined 
        if (oidc) {
            return oidc
        }
    } catch( e ) {
        clearOidcCookie( res )
        console.error(e)
    }
    return undefined
}

export const saveOidc = async ( res: NextApiResponse, oidc: OIDC) => {
    try {
        const encCookie = await encryptObj(oidc, config.secret as string)
        res.appendHeader('Set-Cookie',serialize( oidcName, encCookie, {
            httpOnly: true,
            secure: config.production,
            maxAge: 5 * 60, // 5 minutes
            path: config.apiRoute
        }))
    } catch (e) {
        console.error(e)
    }
}

export const clearOidcCookie = ( res: NextApiResponse) => {    
    res.appendHeader('Set-Cookie',serialize(oidcName, '', {
        expires: new Date(0), // Set the expiry date to a date in the past
        path: config.apiRoute
    }))
}