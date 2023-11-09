// use Express for type information

import { 
    FastifyPluginAsync,
 } from 'fastify'
import fp from 'fastify-plugin'

import { 
    FastifyInstance,
    FastifyRegisterOptions,
    FastifyPluginCallback,
    // fastify next function 
    FastifyRequest,
    FastifyReply,
    RouteHandler,
    FastifyPluginOptions
} from 'fastify'

import { serialize } from 'cookie'

import { Auth, NotLoggedIn } from '@hellocoop/types'
import { 
    router,
    HelloResponse, 
    HelloRequest, 
    clearAuthCookieParams,
    getAuthfromCookies, 
    isConfigured,
    configure,
    Config,
}  from '@hellocoop/router'



// export type AuthRequest = Request & {
//     auth?: Auth
// }


// const clearAuthCookie = ( res: HelloResponse) => {
//     const { name, value, options } = clearAuthCookieParams()
//     res.setCookie(name, value, options)
// }

// const sendJSON = (res: FastifyReply, data: any) => {
//     res.header('Content-Type', 'application/json')
//     res.send(JSON.stringify(data))
// }

const convertToHelloRequest = ( req: FastifyRequest ): HelloRequest => {
    return {
        headers: () => { return req.headers as { [key: string]: string }},
        query: req.query as { [key: string]: string } | {},
        path: req.routeOptions.url,
        getAuth: () => { return req.auth },
        setAuth: (auth: Auth) => {req.auth = auth},
    }
}


const convertToHelloResponse = ( res: FastifyReply ): HelloResponse => {
    return {
        clearAuth: () => {
            const { name, value, options } = clearAuthCookieParams()
            res.header('Set-Cookie', serialize(name, value, options))
        },
        send: (data: any) => res.type('text/html').send( data ),
        json: (data: any) => res.send( data),
        redirect: (url : string) => res.redirect(url),
        setCookie: (name: string, value: string, options: any) => {
            res.header('Set-Cookie', serialize(name, value, options))
        },
        setHeader: (name: string, value: string) => res.header(name, value),
        status: ( statusCode: number) => { 
            res.code(statusCode) 
            return {
                send: (data: any) => res.send(data)
            }
        },
    }
}


// const setAuthMiddleware = async function ( req: FastifyRequest, res: FastifyReply, next: NextFunction) {
//     req.getAuth = async (): Promise<Auth> => {
//         const helloReq = convertToHelloRequest(req)
//         const helloRes = convertToHelloResponse(res)
//         if (req.auth)
//             return req.auth
//         req.auth = await getAuthfromCookies( helloReq, helloRes) || NotLoggedIn
//         return req.auth as Auth
//     }
//     res.clearAuth = () => {
//         const helloRes = convertToHelloResponse(res)
//         clearAuthCookie(helloRes)
//     }
//     next()
// }


declare module 'fastify' {
    interface FastifyRequest {
      auth?: Auth,
      getAuth: () => Promise<Auth>
    }
    interface FastifyReply {
      clearAuth: () => void,
    }
  }
  
export interface HelloConfig extends FastifyPluginOptions, Config {}
  
  
  const helloPlugin: FastifyPluginAsync <HelloConfig> = async (instance, options) => {
    configure(options)
    instance.decorateRequest('auth', undefined)
    instance.decorateRequest('getAuth', async function () { 
        const helloReq = convertToHelloRequest(this)
        return await getAuthfromCookies(helloReq)  
     })
    instance.decorateReply('clearAuth', function () {
        const { name, value, options } = clearAuthCookieParams()
        this.header('Set-Cookie', serialize(name, value, options))
    })

    instance.get('/api/hellocoop', async (req, res) => {
      const helloReq = convertToHelloRequest(req)
      const helloRes = convertToHelloResponse(res)
      return await router(helloReq, helloRes)
    })
  }
  
  // export plugin using fastify-plugin
  

//   export default fp( helloPlugin, '3.x')


export default fp( helloPlugin )