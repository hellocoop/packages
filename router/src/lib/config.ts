import { Config, LoggedInParams, LoggedInResponse } from '../types'
import { Scope, ProviderHint } from '@hellocoop/types'
import { checkSecret } from '@hellocoop/core'

export interface IConfig {
    production: boolean,
    sameSiteStrict?: boolean,
    error?: string[],
    scope?: Scope[],
    provider_hint?: ProviderHint[],
    routes: {
        loggedIn: string,
        loggedOut: string,
        error?: string
    },
    cookies: {
        authName: string,
        oidcName: string,
    },
    callbacks: {
        loggedIn?: (params: LoggedInParams) => Promise<LoggedInResponse>
    },
    cookieToken?: boolean, // include encrypted cookie in auth response
    // built from HELLO_API_ROUTE
    apiRoute: string,
    authApiRoute: string,
    loginApiRoute: string,
    logoutApiRoute: string,
    // configured only by process.env or .env
    clientId: string,
    host: string | undefined ,
    redirectURI: string | undefined,
    // for internal testing
    helloDomain: string,
    helloWallet: string,
    secret?: string
}

const HELLO_API_ROUTE = process.env.HELLO_API_ROUTE as string || '/api/hellocoop'
const HELLO_DOMAIN = process.env.HELLO_DOMAIN as string || 'hello.coop'

const _configuration: IConfig = {
    production: process.env.NODE_ENV === 'production',
    routes: {
        loggedIn: '/',
        loggedOut: '/',
    },
    cookies: {
        authName: 'hellocoop_auth',
        oidcName: 'hellocoop_oidc',
    },
    callbacks: {},
    apiRoute: HELLO_API_ROUTE,
    authApiRoute: HELLO_API_ROUTE+'?op=auth',
    loginApiRoute: HELLO_API_ROUTE+'?op=login',
    logoutApiRoute: HELLO_API_ROUTE+'?op=logout',


    // configured only by process.env or .env
    clientId:  process.env.HELLO_CLIENT_ID as string,
    secret:  process.env.HELLO_COOKIE_SECRET as string,
    host: undefined,
    redirectURI: process.env.HELLO_HOST 
            ? `https://${process.env.HELLO_HOST}${HELLO_API_ROUTE}` 
            : undefined,
    // for internal testing
    helloDomain: HELLO_DOMAIN,
    helloWallet
        :  process.env.HELLO_WALLET as string
        || 'https://wallet.'+HELLO_DOMAIN,
}

export let isConfigured: boolean = false


const pendingConfigurations: ((config: any) => void)[] = [];

export const configure = function ( config: Config ) {
    _configuration.clientId = process.env.HELLO_CLIENT_ID || config.client_id as string
    if (config.routes) {
        _configuration.routes = {
            ..._configuration.routes,
            ...config.routes
        }
    }
    _configuration.callbacks = config.callbacks || {}
    if (process.env.HELLO_SCOPES)
        _configuration.scope = process.env.HELLO_SCOPES.split(' ') as Scope[]
    else
        _configuration.scope = config.scope

    if (process.env.HELLO_PROVIDER_HINT)
        _configuration.provider_hint = process.env.HELLO_PROVIDER_HINT.split(' ') as ProviderHint[]
    else
        _configuration.provider_hint = config.provider_hint

    _configuration.sameSiteStrict = !!process.env.HELLO_SAME_SITE_STRICT || config.sameSiteStrict
    _configuration.cookieToken = !!process.env.HELLO_COOKIE_TOKEN || config.cookieToken
    
    isConfigured = true
    if (!_configuration.clientId) {
        const message = 'No HELLO_CLIENT_ID was in environment or client_id in hello.config'
        _configuration.error = [message]
        console.error(message)
        isConfigured = false
    } 
    if (!_configuration.secret) {
        const message = 'No HELLO_COOKIE_SECRET was in environment'
        _configuration.error = [message]
        console.error(message)
        isConfigured = false
    } 
    if (_configuration.secret && !checkSecret(_configuration.secret)) {
        const message = 'HELLO_COOKIE_SECRET is not 32 hex digits'
        _configuration.error = [message]
        console.error(message)
        isConfigured = false
    }
    while (pendingConfigurations.length > 0) {
        const resolve = pendingConfigurations.pop();
        if (resolve)
            resolve(_configuration);
      }
// console.log({isConfigured})
// console.log({_configuration})

}

export const getConfig = function ():Promise<IConfig> {
    if (!isConfigured) {
        return new Promise((resolve) => {
          pendingConfigurations.push(() => resolve(_configuration));
        });
      }
      return Promise.resolve(_configuration);
}

export const getLoginApiRoute = ():string => {return _configuration.loginApiRoute}
export const getLogoutApiRoute = ():string => {return _configuration.logoutApiRoute}
export const getAuthApiRoute = ():string => {return _configuration.authApiRoute}
export const getApiRoute = ():string => {return _configuration.apiRoute}

export default _configuration