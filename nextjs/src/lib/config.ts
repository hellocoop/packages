import type { IronSessionOptions } from 'iron-session'
import { DEFAULT_SCOPE } from '@hellocoop/utils'

export const apiRoute: string        
    = process.env.HELLOCOOP_API_ROUTE
    || '/api/hellocoop'

export const defaultReturnToRoute: string
    =  process.env.HELLOCOOP_DEFAULT_RETURN_TO_ROUTE
    || '/'

export const defaultLoggedOutRoute: string
    =  process.env.HELLOCOOP_DEFAULT_LOGGED_OUT_ROUTE
    || '/'

export const host: string | undefined 
    = process.env.HELLO_HOST

export const redirectURI: string | undefined
    =  process.env.HELLO_REDIRECT_URI
    || process.env.HELLOCOOP_HOST ? `https://${process.env.HELLOCOOP_HOST}${process.env.HELLOCOOP_ROUTE}` : undefined

export const defaultScope             
    = (process.env.HELLOCOOP_DEFAULT_SCOPE as string)?.split(',').map((s) => s.trim())
    || DEFAULT_SCOPE

export const clientId: string 
    =  process.env.HELLOCOOP_CLIENT_ID as string
    || process.env.HELLOCOOP_CLIENT_ID_DEFAULT as string // from next.config.js

export const sessionOptions: IronSessionOptions = {
    cookieName: 'hellocoop-nextjs',
    password:   process.env.HELLOCOOP_SESSION_SECRET as string
                || process.env.HELLOCOOP_SESSION_SECRET_DEFAULT as string, // from next.config.js
    cookieOptions: {
        // secure: true should be used in production (HTTPS) but not development (HTTP)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    } 
}



export const userApiRoute: string =         `${apiRoute}?profile=me`
export const loginApiRoute: string =        `${apiRoute}?login=true`
export const logoutApiRoute: string =       `${apiRoute}?logout=true`

export const allowedOrigin: string = (new URL('https://wallet.hello.coop')).origin


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



