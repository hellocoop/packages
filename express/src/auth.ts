import { Router, Request, Response, NextFunction } from 'express'
import { serialize } from 'cookie'

import { Auth } from '@hellocoop/types'
import { 
    router,
    HelloResponse, 
    HelloRequest, 
    clearAuthCookieParams,
    getAuthfromCookies, 
    isConfigured,
    configure,
    Config,
    configuration
} from '@hellocoop/router'

export type HelloConfig = Config

const convertToHelloRequest = (req: Request): HelloRequest => {
    return {
        headers: () => req.headers as { [key: string]: string },
        query: req.query as { [key: string]: string } | {},
        path: req.path,
        getAuth: () => req.auth,
        setAuth: (auth: Auth) => { req.auth = auth },
        method: req.method,
        body: req.body
    }
}

const convertToHelloResponse = (res: Response): HelloResponse => {
    return {
        clearAuth: () => {
            const { name, value, options } = clearAuthCookieParams()
            res.setHeader('Set-Cookie', serialize(name, value, options))
        },
        send: (data: any) => res.type('text/html').send(data),
        json: (data: any) => res.json(data),
        redirect: (url: string) => res.redirect(url),
        setCookie: (name: string, value: string, options: any) => {
            res.setHeader('Set-Cookie', serialize(name, value, options))
        },
        setHeader: (name: string, value: string) => res.setHeader(name, value),
        status: (statusCode: number) => { 
            res.status(statusCode)
            return {
                send: (data: any) => res.send(data)
            }
        },
    }
}


declare global {
    namespace Express {
      interface Request {
        auth?: Auth;
        getAuth(): Promise<Auth>;
      }
      interface Response {
        clearAuth(): void;
      }
    }
  }

// // Express middleware for auth
// app.use( async (req: Request, res: Response, next: NextFunction) => {
//     const helloReq = convertToHelloRequest(req)
//     req.auth = await getAuthfromCookies(helloReq)
//     next()
// })

// // Express route
// app.get('/api/hellocoop', async (req: Request, res: Response) => {
//     const helloReq = convertToHelloRequest(req)
//     const helloRes = convertToHelloResponse(res)
//     return await router(helloReq, helloRes)
// })

// Configure plugin options if needed


export const auth = function ( config: Config): Router {
    if (!isConfigured) {
        configure(config as Config)
    }

console.log({isConfigured,configuration})

    const r = Router()
    r.use(async (req: Request, res: Response, next: NextFunction) => {
        const helloReq = convertToHelloRequest(req)
        req.getAuth = async () => { 
            req.auth = await getAuthfromCookies(helloReq) 
            return req.auth
        }
        res.clearAuth = () => {
            const { name, value, options } = clearAuthCookieParams()
            res.setHeader('Set-Cookie', serialize(name, value, options))
        }
        next()
    })

    r.get('/api/hellocoop', async (req: Request, res: Response ) => {
        const helloReq = convertToHelloRequest(req)
        const helloRes = convertToHelloResponse(res)
        await router(helloReq, helloRes)   
    })
    return r
}

