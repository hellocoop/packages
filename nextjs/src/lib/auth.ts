import { Claims } from '@hellocoop/utils'
import { NextApiRequest, NextApiResponse } from 'next'

export type AuthCookie =
    {
        sub: string,
        iat: number
    } & Claims & {
        [key: string]: any; // Allow arbitrary optional properties
    }

export type Auth = {
    isLoggedIn: false
} | ({
    isLoggedIn: true,
    sub: string,
    iat: number
} & AuthCookie )


const decrypt = async function ( cookie: string ): Promise< {[key: string]: any;}| null> {
    return null
}

const encrypt = async function ( payload: {[key: string]: any;} ): Promise<string | null> {
    return ''
}

export const saveAuthCookie = async ( res: NextApiResponse, auth: Auth ): Promise<boolean> =>  {
    return true
}

export const clearAuthCookie = async ( res: NextApiResponse) =>  {
    return
}


export const getAuthfromCookies = async function 
        ( cookies: Partial<{[key: string]: string;}> )
        : Promise<Auth> {
    const authCookie = cookies['auth']
    if (!authCookie)
        return {isLoggedIn:false}
    const auth = await decrypt(authCookie) as AuthCookie
    if (auth && auth.sub) {
        return {
            isLoggedIn: true, ...auth
        }
    }
    return {isLoggedIn:false}
}