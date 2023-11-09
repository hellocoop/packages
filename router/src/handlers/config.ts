import { HelloRequest, HelloResponse } from '../types'
import { Claims, Scope, ProviderHint } from '@hellocoop/types'
export  { Claims, Scope }

export type LoggedInParams = {
    token: string,
    payload: Claims,
    req: HelloRequest,
    res: HelloResponse
}


export type LoggedInHelloResponse = {
    accessDenied?: boolean,
    target_uri?: string,
    updatedAuth?: {[key: string]: any}
}


export type Config = {
    client_id?: string,
    scope?: Scope[],
    provider_hint?: ProviderHint[],
    callbacks?: {
        loggedIn?: (params: LoggedInParams) => Promise<LoggedInHelloResponse>
    },
    routes?: {
        loggedIn?: string,
        loggedOut?: string,
        error?: string
    }
}

