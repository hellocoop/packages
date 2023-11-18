import { NextFunction, Request, Response } from 'express'

import { getAuthfromCookies, saveAuthCookie, clearAuthCookie } from '../lib/auth'

import { Auth, Claims } from '@hellocoop/types'
import { NotLoggedIn } from '@hellocoop/constants'

// export type AuthRequest = Request & {
//     auth?: Auth
// }

export type AuthUpdates =
    Claims & {
        [key: string]: any; // Allow arbitrary optional properties
    }

export const handleAuth = async function (req: Request, res: Response) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json(await req.getAuth()) 
}

export const clearAuth = async function ( res: Response) {
    clearAuthCookie(res)
}

export const setAuthMiddleware = async function ( req: Request, res: Response, next: NextFunction) {
    let auth: Auth | undefined = undefined
    req.getAuth = async () => {
        if (req.auth)
            return req.auth
        req.auth = await getAuthfromCookies( req, res) || NotLoggedIn
        return req.auth
    }
    res.clearAuth = async () => {
        await clearAuth(res)
    }
    next()
}

export const updateAuth = async function ( req: Request, res: Response, authUpdates: AuthUpdates )
        : Promise<Auth | null> {
    const auth = await getAuthfromCookies( req, res )
    if (!auth.isLoggedIn)
        return auth
    const newAuth = {
        ...auth,
        ...authUpdates,
        sub: auth.sub,
        iat: auth.iat
    }
    const success = await saveAuthCookie( res, newAuth)
    if (success)
        return newAuth
    return null
}