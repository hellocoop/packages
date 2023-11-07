import { decryptObj, encryptObj } from '@hellocoop/core'
import { Auth } from '@hellocoop/types'
import { Request, Response } from 'express'

import config from './config'
import { serialize, parse, CookieSerializeOptions } from 'cookie'
import { clearOidcCookie } from './oidc'

const { cookies: {authName, oidcName} } = config 

const laxAuthName = 'lax-'+authName

const setEncryptedCookie = ( res: Response, sameSite: boolean, encCookie: string ) => {
    const cookieName = sameSite ? authName : laxAuthName

    const options: CookieSerializeOptions = {
        httpOnly: true,
        secure: config.production,
        path: '/' // let any server side route call getAuth
    }
    if (sameSite)
        options.sameSite = 'strict'

    res.appendHeader('Set-Cookie', serialize(cookieName, encCookie, options))  
}

export const saveAuthCookie = async ( res: Response, auth: Auth, sameSite: boolean = false ): Promise<boolean> =>  {
    try {
        const encCookie = await encryptObj(auth, config.secret as string)
        if (!encCookie)
            return false
        setEncryptedCookie( res, sameSite, encCookie)
        return true    
    } catch (e) {
        console.error(e)
    }
    return false
}

export const clearAuthCookie = async ( res: Response) =>  {
    res.appendHeader('Set-Cookie',serialize(authName, '', {
        expires: new Date(0), // Set the expiry date to a date in the past
        path: '/', // Specify the path
      }))
}


export const getAuthfromCookies = async function 
        ( req: Request, res: Response )
        : Promise<Auth> {

    const cookies = parse(req.headers.cookie || '')
    
    if (cookies[oidcName]) // clear OIDC cookie it still there
        clearOidcCookie(res)

    const laxAuthCookie = cookies[laxAuthName]
    if (laxAuthCookie) {
        // rotate to a sameSite:strict cookie
        setEncryptedCookie(res,true,laxAuthCookie)
        res.appendHeader('Set-Cookie', serialize(laxAuthName, '', {
            expires: new Date(0),
            path: '/', // Specify the path
        }));
    }
    
    const authCookie = cookies[authName] || laxAuthCookie
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