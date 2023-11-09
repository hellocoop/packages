// import { Request, Response, NextFunction } from 'express'
// import { Auth } from '@hellocoop/types'
// import { configuration } from '@hellocoop/router'

// export const redirect = function ( target:string ) {
//     return async ( req: Request, res: Response, next: NextFunction) => {
//         const auth: Auth = await req.getAuth()
//         if (auth.isLoggedIn)
//             next()
//         else 
//             res.redirect(target)
//     }
// }

// export const unauthorized = async ( req: Request, res: Response, next: NextFunction) => {
//     const auth: Auth = await req.getAuth()
//     if (auth.isLoggedIn)
//         next()
//     else 
//         res.setHeader('WWW-Authenticate',`Hello ${configuration.clientId}`).status(401).send()
// }

// export const setAuth = async ( req: Request, res: Response, next: NextFunction) => {
//     await req.getAuth() // sets req.auth
//     next()
// }

import { FastifyRequest, FastifyReply } from 'fastify'
import { Auth } from '@hellocoop/types'
import { configuration } from '@hellocoop/router'

// Assuming getAuth is available on the Fastify request object
declare module 'fastify' {
  interface FastifyRequest {
    getAuth: () => Promise<Auth>;
  }
}

export const redirect = (target: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const auth: Auth = await request.getAuth();
    if (auth.isLoggedIn) {
      return; // equivalent to Express' next()
    } else {
      return reply.redirect(target);
    }
  };
};

export const unauthorized = async (request: FastifyRequest, reply: FastifyReply) => {
  const auth: Auth = await request.getAuth();
  if (!auth.isLoggedIn) {
    reply.header('WWW-Authenticate', `Hello ${configuration.clientId}`).status(401);
    return reply.send(); // sending the response
  }
};

export const setAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.getAuth(); // Assuming this sets something like request.auth
};
