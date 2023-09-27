import type { IronSessionOptions } from 'iron-session'
import { DEFAULT_SCOPE } from '@hellocoop/utils'

export const apiRoute =                 
    process.env.HELLOCOOP_API_ROUTE
    || '/api/hellocoop'
export const defaultReturnToRoute =     
    process.env.HELLOCOOP_DEFAULT_RETURN_TO_ROUTE
    || '/'
export const defaultLoggedOutRoute =    
    process.env.HELLOCOOP_DEFAULT_LOGGED_OUT_ROUTE
    || '/'
export const defaultScope =            
    (process.env.HELLOCOOP_DEFAULT_SCOPE as string)?.split(',').map((s) => s.trim())
    || DEFAULT_SCOPE
export const clientId =
    process.env.HELLOCOOP_CLIENT_ID as string
    || process.env.HELLOCOOP_CLIENT_ID_DEFAULT as string // from next.config.js
export const sessionOptions = {
    cookieName: 'hellocoop-nextjs',
    password:   process.env.HELLOCOOP_SESSION_SECRET as string
                || process.env.HELLOCOOP_SESSION_SECRET_DEFAULT as string, // from next.config.js
    cookieOptions: {
        // secure: true should be used in production (HTTPS) but not development (HTTP)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    }
}

export const userApiRoute =         `${apiRoute}?profile=me`
export const loginApiRoute =        `${apiRoute}?login=true`
export const logoutApiRoute =       `${apiRoute}?logout=true`

// const requiredScopes = ['openid']

// export interface Config {
//     redirectURI?: string,
//     apiRoute: string,
//     userApiRoute: string,
//     defaultReturnToRoute: string,
//     clientId?: string,
//     scopes: string[],
//     sessionOptions: IronSessionOptions
// }



