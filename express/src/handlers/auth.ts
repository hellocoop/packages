import { NextFunction, Request, Response } from 'express'

import { Auth, getAuthfromCookies, saveAuthCookie, clearAuthCookie } from '../lib/auth'

import { Claims } from '@hellocoop/types'
import { NotLoggedIn } from '../lib/auth'

export type AuthRequest = Request & {
    auth?: Auth
}

export type AuthUpdates =
    Claims & {
        [key: string]: any; // Allow arbitrary optional properties
    }

export const handleAuth = async function (req: AuthRequest, res: Response) {
    res.json(req.auth) 
}

export const clearAuth = async function ( res: Response) {
    clearAuthCookie(res)
}

export const setAuthMiddleware = async function ( req: AuthRequest, res: Response, next: NextFunction) {
    const auth = await getAuthfromCookies( req, res) 
    req.auth = auth || NotLoggedIn
    next()
}

export const updateAuth = async function ( req: AuthRequest, res: Response, authUpdates: AuthUpdates )
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