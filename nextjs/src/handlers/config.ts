import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { configured, configure } from '../lib/config'
import router from './router'
import { Claims, Scope } from '@hellocoop/utils'


export type LoggedInParams = {
    token: string,
    payload: Claims,
    req: NextApiRequest,
    res: NextApiResponse
}


export type LoggedInResponse = {
    accessDenied?: boolean,
    isProcessed?: boolean,
    updatedAuth?: {[key: string]: any}
}


export type Config = {
    scope?: Scope[],
    callbacks?: {
        loggedIn?: (params: LoggedInParams) => Promise<LoggedInResponse>
    },
    routes?: {
        loggedIn?: string,
        loggedOut?: string,
        error?: string
    }
}

export const HelloAuth = function ( config: Config | {} | undefined 
        | NextApiRequest, res?: NextApiResponse) // directly used as a NextApiHandler
        : NextApiHandler | undefined {
    if (res) {
        const req = config as NextApiRequest
        if (!configured)
            configure({})
        router( req, res )
        return
    }

    if (!configured!) {
        configure(config as Config)
    }
    return router

}
