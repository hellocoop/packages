import type { IronSessionOptions } from 'iron-session'
import { DEFAULT_SCOPE } from '@hellocoop/utils'
export const apiRoute = '/api/hellocoop'
export const defaultReturnToRoute = '/'

export const defaultUserApiRoute = '/api/hellocoop?profile=me'

const requiredScopes = ['openid']

export interface Config {
    redirectURI?: string,
    apiRoute: string,
    userApiRoute: string,
    defaultReturnToRoute: string,
    clientId?: string,
    scopes: string[],
    sessionOptions: IronSessionOptions
}

const getConfig = (config?: Partial<Config>): Config => {
    const sessionSecret =
        config?.sessionOptions?.password
        || process.env.HELLOCOOP_SESSION_SECRET as string
        || process.env.HELLOCOOP_SESSION_SECRET_DEFAULT as string // from next.config.js
    const scopes = [
        ...new Set(
            [
                ...requiredScopes,
                ...(config?.scopes
                    || (process.env.HELLOCOOP_SCOPES as string)?.split(',').map((s) => s.trim())
                    || DEFAULT_SCOPE)
            ]
        )
    ]
    const userApiRoute = config?.userApiRoute || (process.env.HELLOCOOP_ROUTE as string || apiRoute) + '?profile=me'
    
    return {
        userApiRoute,
        apiRoute: config?.apiRoute
            || process.env.HELLOCOOP_ROUTE as string
            || apiRoute,
        defaultReturnToRoute: config?.defaultReturnToRoute
            || process.env.HELLOCOOP_DEFAULT_RETURN_TO_ROUTE as string
            || defaultReturnToRoute,
        clientId: config?.clientId
        || process.env.HELLOCOOP_CLIENT_ID as string
        || process.env.HELLOCOOP_CLIENT_ID_DEFAULT as string, // from next.config.js
        scopes,
        sessionOptions: {
            cookieName: 'hellocoop-nextjs',
            password: sessionSecret,
            cookieOptions: {
                // secure: true should be used in production (HTTPS) but not development (HTTP)
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                ...(config?.sessionOptions ?? {})
            }
        },
        ...config
    }
}

export default getConfig
