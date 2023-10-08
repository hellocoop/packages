import { Claims } from '@hellocoop/utils'
import { NextApiRequest, NextApiResponse } from 'next'

import config from './config'
import { serialize } from 'cookie'

const { cookies } = config
const { authName } = cookies 

export type AuthCookie =
    {
        sub: string,
        iat: number
    } & Claims & {
        [key: string]: any; // Allow arbitrary optional properties
    }

export type Auth = {
    isLoggedIn: false
} | ({
    isLoggedIn: true,
    sub: string,
    iat: number
} & AuthCookie )


export const saveAuthCookie = async ( res: NextApiResponse, auth: Auth ): Promise<boolean> =>  {
    const json = JSON.stringify(auth)
    // TBD encrypt cookie
    const encCookie = Buffer.from(json).toString('base64')
    res.setHeader('Set-Cookie',serialize( authName, encCookie, {
        httpOnly: true,
        // TBD - expire in 5 minutes
        path: '/' // TBD restrict to API path
    }))
    return true
}

export const clearAuthCookie = async ( res: NextApiResponse) =>  {
    res.setHeader('Set-Cookie',serialize(authName, '', {
        expires: new Date(0), // Set the expiry date to a date in the past
        path: '/', // Specify the path
      }))
}


export const getAuthfromCookies = async function 
        ( cookies: Partial<{[key: string]: string;}> )
        : Promise<Auth> {
    const authCookie = cookies[authName]
    if (!authCookie)
        return {isLoggedIn:false}

    try {
        // TBD - change to decrypt cookie
        const json = Buffer.from(authCookie, 'base64').toString()
        const auth = JSON.parse(json)
        if (auth && auth.sub) {
            return {
                isLoggedIn: true, ...auth
            }
        }
    } catch( e ) {
        console.error(e)
    }
    return {isLoggedIn:false}
}
