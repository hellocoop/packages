import { Router, Request, Response } from 'express'
import cors from 'cors'
import { isConfigured, configure } from '../lib/config'
import router from './router'
import { Claims, Scope, ProviderHint } from '@hellocoop/types'
import { setAuthMiddleware } from './auth'
export  { Claims, Scope }

export type LoggedInParams = {
    token: string,
    payload: Claims,
    req: Request,
    res: Response
}


export type LoggedInResponse = {
    accessDenied?: boolean,
    isProcessed?: boolean,
    updatedAuth?: {[key: string]: any}
}


export type Config = {
    client_id?: string,
    scope?: Scope[],
    provider_hint?: ProviderHint[],
    callbacks?: {
        loggedIn?: (params: LoggedInParams) => Promise<LoggedInResponse>
    },
    routes?: {
        loggedIn?: string,
        loggedOut?: string,
        error?: string
    }
}

export const auth = function ( config: Config): Router {
    if (!isConfigured) {
        configure(config as Config)
    }
    const r = Router()
    r.use(setAuthMiddleware)
    r.get('/api/hellocoop',cors(),router)
    return r
}
