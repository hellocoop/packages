import { Scope } from '@hellocoop/utils'
import { Config, LoggedInParams, LoggedInResponse } from '../handlers/config'


export interface IConfig {
    error?: string[],
    scope?: Scope[],
    routes: {
        hellocoop: string,
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
    // built from routes.helloop
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
}

const HELLO_API_ROUTE = process.env.HELLO_API_ROUTE as string || '/api/hellocoop'
const HELLO_DOMAIN = process.env.HELLO_DOMAIN as string || 'hello.coop'

const _configuration: IConfig = {
    routes: {
        hellocoop: HELLO_API_ROUTE,
        loggedIn: '/',
        loggedOut: '/',
    },
    cookies: {
        authName: 'hellcoop_auth',
        oidcName: 'hellcoop_oidc',
    },
    callbacks: {},
    authApiRoute:'',
    loginApiRoute:'',
    logoutApiRoute:'',

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
        || 'https://wallet.'+HELLO_DOMAIN
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
    const apiRoute = _configuration.routes.hellocoop
    // set API routes
    _configuration.authApiRoute = apiRoute+'?auth=true'
    _configuration.loginApiRoute = apiRoute+'?login=true'
    _configuration.logoutApiRoute = apiRoute+'logout=true'
    if (!_configuration.clientId) {
        _configuration.error = ['NO CLIENT ID WAS FOUND']
    }
    // not sure this will work
    deepFreeze(_configuration)
}

export default _configuration