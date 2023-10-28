import { Claims, decryptObj, encryptObj } from '@hellocoop/core'
import { NextApiRequest, NextApiResponse } from 'next'

import config from './config'
import { serialize } from 'cookie'
import { clearOidcCookie } from './oidc'

const { cookies } = config
const { authName, oidcName } = cookies 

export type AuthCookie = {
        sub: string,
        iat: number
    } & Claims & {
        [key: string]: any; // Allow arbitrary optional properties
    }

export type Auth = {
    isLoggedIn: false
} | ({
    isLoggedIn: true,
} & AuthCookie )

export const saveAuthCookie = async ( res: NextApiResponse, auth: Auth ): Promise<boolean> =>  {
    try {
        const encCookie = await encryptObj(auth, config.secret as string)
        if (!encCookie)
            return false
        res.appendHeader('Set-Cookie',serialize( authName, encCookie, {
            httpOnly: true,
            secure: config.production,
            sameSite: 'strict',
            path: '/' // let any server side getAuth
            // no maxAge => session cooke
        }))
        return true    
    } catch (e) {
        console.error(e)
    }
    return false
}

export const clearAuthCookie = async ( res: NextApiResponse) =>  {
    res.appendHeader('Set-Cookie',serialize(authName, '', {
        expires: new Date(0), // Set the expiry date to a date in the past
        path: '/', // Specify the path
      }))
}


export const getAuthfromCookies = async function 
        ( res: NextApiResponse, cookies: Partial<{[key: string]: string;}> )
        : Promise<Auth> {

    if (cookies[oidcName]) // clear OIDC cookie it still there
        clearOidcCookie(res)

    const authCookie = cookies[authName]
    if (!authCookie)
        return NotLoggedIn
    try {
        const auth = await decryptObj( authCookie, config.secret as string) as Auth | undefined 
        if (auth) {
            return auth
        }
    } catch( e ) {
        await clearAuthCookie( res )
        console.error(e)
    }
    return NotLoggedIn
}

export const NotLoggedIn: Auth = { isLoggedIn: false}