// Helle router types

import type { Claims, Scope, ProviderHint, Auth } from '@hellocoop/types'
import type { CookieSerializeOptions } from 'cookie'

export type CallbackRequest = {
    getHeaders: () => Record<string, string>,
}


export type CallbackResponse = {
    setHeader: (key: string, value: string) => void,
    setCookie: (key: string, value: string, options: CookieSerializeOptions) => void,
}

export type LoggedInParams = {
    token: string,
    payload: Claims,
    cbReq: CallbackRequest,
    cbRes: CallbackResponse
}

export type LoggedInResponse = {
    accessDenied?: boolean,
    target_uri?: string,
    updatedAuth?: {[key: string]: any}
}

export interface Config {
    client_id?: string,
    scope?: Scope[],
    provider_hint?: ProviderHint[],
    sameSiteStrict?: boolean,
    callbacks?: {
        loggedIn?: (params: LoggedInParams) => Promise<LoggedInResponse>
    },
    routes?: {
        loggedIn?: string,
        loggedOut?: string,
        error?: string
    },
    cookieToken?: boolean,
}

export type HelloRequest = {
    getAuth: () => Auth | undefined,
    headers: () => { [key: string]: string };
    path: string;
    query: { [key: string]: string };
    setAuth: ( auth: Auth) => void,
    method: string,
    body: any
};
  
export type HelloResponse = {
    clearAuth: () => void,
    send: (data: string) => void;
    json: ( data : any ) => void;
    redirect: (url: string) => void;
    setCookie: (name: string, value: string, options: CookieSerializeOptions) => void;
    setHeader: (name: string, value: string) => void;
    status: (statusCode: number) => { send: (data: any) => void };
};


