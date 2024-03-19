import { HelloRequest, HelloResponse } from '../types'
import { Claims, Scope, ProviderHint } from '@hellocoop/types'
export  { Claims, Scope }

export type LoginTriggerParams = {
    token: string,
    payload: Claims,
    req: HelloRequest,
    res: HelloResponse
}


export type LoginTriggerResponse = {
    accessDenied?: boolean,
    target_uri?: string,
    updatedAuth?: {[key: string]: any}
}


