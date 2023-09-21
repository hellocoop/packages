import type { IronSessionOptions } from 'iron-session'

// TODO - change these to just the one route
export const defaultLoginRoute = '/api/hellocoop'
export const defaultCallbackRoute = '/api/hellocoop'
export const defaultQuickstartRoute = '/api/hellocoop'
export const defaultReturnToRoute = '/'

export const defaultUserApiRoute = '/api/hellocoop?profile=me'

const requiredScopes = ['openid']
const defaultScopes = [...requiredScopes, 'name', 'email']

export interface Config {
    redirect_uri?: any
    enableQuickstart: boolean,
    baseUrl?: string,
    loginRoute: string,
    callbackRoute: string,
    quickstartRoute: string,
    defaultReturnToRoute: string,
    helloClientId?: string,
    helloScopes: string[],
    sessionSecret?: string,
    sessionOptions: IronSessionOptions
}

const getConfig = (config?: Partial<Config>): Config => {
    const sessionSecret =
        config?.sessionSecret
        || process.env.HELLO_SESSION_SECRET as string
    const helloScopes = [
        ...new Set(
            [
                ...requiredScopes,
                ...(config?.helloScopes
                    || (process.env.HELLO_SCOPES as string)?.split(',').map((s) => s.trim())
                    || defaultScopes)
            ]
        )
    ]

    return {
        enableQuickstart: config?.enableQuickstart
            || process.env.HELLO_ENABLE_QUICKSTART as string === true.toString()
            || process.env.NODE_ENV !== 'production',
        baseUrl: config?.baseUrl
            || process.env.HELLO_BASE_URL as string,
        loginRoute: config?.loginRoute
            || process.env.NEXT_PUBLIC_HELLO_LOGIN_API_ROUTE as string
            || defaultLoginRoute,
        callbackRoute: config?.callbackRoute
            || process.env.HELLO_CALLBACK_API_ROUTE as string
            || defaultCallbackRoute,
        quickstartRoute: config?.quickstartRoute
            || process.env.HELLO_QUICKSTART_API_ROUTE as string
            || defaultQuickstartRoute,
        defaultReturnToRoute: config?.defaultReturnToRoute
            || process.env.HELLO_DEFAULT_RETURN_TO_ROUTE as string
            || defaultReturnToRoute,
        helloClientId: config?.baseUrl
            || process.env.HELLO_CLIENT_ID as string,
        helloScopes,
        sessionSecret,
        sessionOptions: {
            cookieName: 'nextjs-hello',
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
