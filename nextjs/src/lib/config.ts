import { Scope } from '@hellocoop/utils'
import { Config, LoggedInParams, LoggedInResponse } from '../handlers/config'


export interface IConfig {
    error?: string[],
    scope?: Scope[],
    routes: {
        loggedIn: string,
        loggedOut: string,
    },
    cookies: {
        authName: string,
        oidcName: string,
    },
    callbacks: {
        loggedIn?: (params: LoggedInParams) => Promise<LoggedInResponse>
    },
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
    routes: {
        loggedIn: '/',
        loggedOut: '/',
    },
    cookies: {
        authName: (process.env.NODE_ENV === 'production' ? '__Host-':'')+'hellcoop_auth',
        oidcName: 'hellcoop_oidc',
    },
    callbacks: {},
    apiRoute: HELLO_API_ROUTE,
    authApiRoute: HELLO_API_ROUTE+'?getAuth=true',
    loginApiRoute: HELLO_API_ROUTE+'?login=true',
    logoutApiRoute: HELLO_API_ROUTE+'?logout=true',


    // configured only by process.env or .env
    clientId
        :  process.env.HELLO_CLIENT_ID as string
        || process.env.HELLO_CLIENT_ID_DEFAULT as string, // from .env
    host: undefined,
    redirectURI
        :  process.env.HELLO_REDIRECT_URI
        || process.env.HELLO_HOST 
            ? `https://${process.env.HELLO_HOST}${HELLO_API_ROUTE}` 
            : undefined,
    // for internal testing
    helloDomain: HELLO_DOMAIN,
    helloWallet
        :  process.env.HELLO_WALLET as string
        || 'https://wallet.'+HELLO_DOMAIN,
    secret
        :  process.env.HELLO_COOKIE_SECRET 
        || process.env.HELLO_COOKIE_SECRET_DEFAULT
}

function deepFreeze(obj: any): any {
    // Ensure the object is an object (excluding null, which typeof returns 'object')
    if (obj !== null && typeof obj === 'object') {
      // Freeze the object itself
      Object.freeze(obj);
  
      // Recursively freeze properties
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          deepFreeze(obj[key]);
        }
      }
    }
  
  }


export let configured: boolean = false
export const configure = function ( config: Config ) {
    if (!config)
        config = {}
    if (config.routes) {
        _configuration.routes = {
            ..._configuration.routes,
            ...config.routes
        }
    }
    _configuration.callbacks = config.callbacks || {}
    _configuration.scope = config.scope

    configured = true
    if (!_configuration.clientId) {
        const message = 'No HELLO_CLIENT_ID was in environment'
        _configuration.error = [message]
        console.error(message)
        configured = false
    } 
    if (!_configuration.secret) {
        const message = 'No HELLO_COOKIE_SECRET was in environment'
        _configuration.error = [message]
        console.error(message)
        configured = false
    } 
console.log({configured})
console.log({_configuration})
    // not sure this will work
    // deepFreeze(_configuration)
}

export default _configuration