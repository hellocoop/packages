// app router

import { serialize } from 'cookie'
import { NextRequest, NextResponse } from 'next/server';

import { Auth } from '@hellocoop/types'

import { 
    router,
    HelloResponse, 
    HelloRequest, 
    clearAuthCookieParams,
    isConfigured,
    configure,
    Config,
} from '@hellocoop/router'

declare module 'next/server' {
    interface NextRequest {
        auth?: Auth;
    }
}

function headersToObject(headers: Headers): { [key: string]: string } {
    const object: { [key: string]: string } = {};
    headers.forEach((value, key) => {
      object[key] = value;
    });
    return object;
  }
  
  function urlSearchParamsToObject(params: URLSearchParams): { [key: string]: string } {
    const obj: { [key: string]: string } = {};
    params.forEach((value, key) => {
      obj[key] = value;
    })
    return obj;
  }
  


const convertToHelloRequest = (req: NextRequest): HelloRequest => {
    return {
        headers: () => { return headersToObject(req.headers) },
        query: urlSearchParamsToObject(req.nextUrl.searchParams),
        path: req.nextUrl.pathname as string,
        getAuth: () => req.auth,
        setAuth: (auth: Auth) => { req.auth = auth },
        method: req.method,
        body: req.body
    }
}

const convertToHelloResponse = (res: InternalResponse): HelloResponse => {
    return {
        clearAuth: () => {
            const { name, value, options } = clearAuthCookieParams()
            res.headers.append('Set-Cookie', serialize(name, value, options))
        },
        send: (data: any) => { 
            res.body = data
            res.headers.set('Content-Type', 'text/html')
        },
        json: (json: any) => res.json = json,
        redirect: (url: string) => res.redirect = url,
        setCookie: (name: string, value: string, options: any) => {
            res.headers.append('Set-Cookie', serialize(name, value, options))
        },
        setHeader: (name: string, value: string) => res.headers.set(name, value),
        status: (statusCode: number) => { 
            res.status = statusCode
            return {
                send: (data: any) => {
                    res.body = data
                    res.headers.set('Content-Type', 'text/html')
                }
            }
        },
    }
}

type HandlerFunction = (req: NextRequest) => Promise<NextResponse>;
type InternalResponse = { body?: any, json?: any, status: number, headers: Headers, redirect?: string }

export const appAuth = ( config: Config): HandlerFunction => {
    if (!isConfigured) {
        configure(config as Config)
    }
    const r = async (req: NextRequest) => {

        const internalResponse: InternalResponse = {
            status: 200,
            headers: new Headers(),
        }

        const helloReq = convertToHelloRequest(req)
        const helloRes = convertToHelloResponse(internalResponse)
        await router(helloReq, helloRes)   
        if (internalResponse.redirect)
            return NextResponse.redirect(new URL(internalResponse.redirect, req.url), { headers: internalResponse.headers })
        if (internalResponse.json)
            return NextResponse.json( internalResponse.json, { headers: internalResponse.headers } )
        const res = new NextResponse( 
            internalResponse.body, {
                status: internalResponse.status, 
                headers: internalResponse.headers 
            })
        return res
    }
    return r
}
