import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import config from './config'
import { serialize } from 'cookie'

const { cookies } = config
const { oidcName } = cookies 

export type OIDC = {
    code_verifier: string,
    nonce: string,
    redirect_uri: string,
    target_uri: string
}

export const getOidc = async ( req: NextApiRequest): Promise<OIDC | undefined> => {
    try {
        const encCookie = req.cookies[oidcName]
        if (!encCookie)
            return undefined 
        // TBD - change to decrypt cookie
        const json = Buffer.from(encCookie, 'base64').toString()
        const obj = JSON.parse(json)
        return obj as OIDC
    } catch( e ) {
        return undefined
    }
}

export const saveOidc = async ( res: NextApiResponse, oidc: OIDC) => {
    const json = JSON.stringify(oidc)
    // TBD encrypt cookie
    const encCookie = Buffer.from(json).toString('base64')
    res.setHeader('Set-Cookie',serialize( oidcName, encCookie, {
        httpOnly: true,
        // TBD - expire in 5 minutes
        path: '/' // TBD restrict to API path
    }))
}

export const deleteOidc = ( res: NextApiResponse) => {
    res.setHeader('Set-Cookie',serialize(oidcName, '', {
        expires: new Date(0), // Set the expiry date to a date in the past
        path: '/', // Specify the path
      }))
}