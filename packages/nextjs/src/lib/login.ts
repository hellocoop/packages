import { defaultLoginRoute } from './config'

export interface LoginUrlOptions {
    loginRoute?: string,
    sourceRoute: string
}

export const buildLoginRoute = ({
    loginRoute: loginRouteOverride,
    sourceRoute
}: LoginUrlOptions) => {
    const loginRoute = loginRouteOverride || process.env.NEXT_PUBLIC_HELLO_LOGIN_API_ROUTE as string || defaultLoginRoute
    const loginParams = new URLSearchParams({ sourceRoute }).toString()
    return loginRoute + '?' + loginParams
}
