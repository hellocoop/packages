import { 
    GetServerSidePropsContext, 
    GetServerSidePropsResult, 
    NextApiRequest, 
    NextApiResponse 
} from 'next'

import config from '../lib/config'

import { Auth, getAuthfromCookies, saveAuthCookie, clearAuthCookie } from '../lib/auth'

// import { clearCookie, setCookie } from '..,/lib/cookie'
import { Claims } from '@hellocoop/utils'


export type AuthUpdates =
    Claims & {
        [key: string]: any; // Allow arbitrary optional properties
    }


export const getAuth = async function ( req: NextApiRequest, res: NextApiResponse): Promise<undefined> {
    const auth = await getAuthfromCookies( res, req.cookies)
    res.json(auth)  
}

export const handleAuth = async function (req: NextApiRequest, res: NextApiResponse) {
    return await getAuth(req,res)
}

export const getServerSideProps = async function (context:GetServerSidePropsContext)
    : Promise<GetServerSidePropsResult<{auth:Auth}>> {
        const auth = await getAuthfromCookies( context.res as NextApiResponse, context.req.cookies)
        return {
            props: {auth}
        }
    }

export const clearAuth = async function ( res: NextApiResponse) {
    clearAuthCookie(res)
}

export const updateAuth = async function ( req: NextApiRequest, res: NextApiResponse, authUpdates: AuthUpdates )
        : Promise<Auth | null> {
    const auth = await getAuthfromCookies( res, req.cookies)
    if (!auth.isLoggedIn)
        return auth
    const newAuth = {
        ...auth,
        ...authUpdates,
        sub: auth.sub,
        iat: auth.iat
    }
    const success = await saveAuthCookie( res, newAuth)
    if (success)
        return newAuth
    return null
}