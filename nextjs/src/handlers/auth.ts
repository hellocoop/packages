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


export const getServerAuth = async function ( req: NextApiRequest, res: NextApiResponse): Promise<undefined> {
    const auth = await getAuthfromCookies(req.cookies)

    console.log({auth})

    res.end(auth.toString())  
}

export const handleAuth = async function (req: NextApiRequest, res: NextApiResponse) {
    return await getServerAuth(req,res)
}

export const getServerSideProps = async function (context:GetServerSidePropsContext)
    : Promise<GetServerSidePropsResult<{auth:Auth}>> {
        const auth = await getAuthfromCookies(context.req.cookies)
        return {
            props: {auth}
        }
    }

export const clearAuth = async function ( res: NextApiResponse) {
    clearAuthCookie(res)
}

export const updateAuth = async function ( req: NextApiRequest, res: NextApiResponse, authUpdates: AuthUpdates )
        : Promise<Auth | null> {
    const auth = await getAuthfromCookies(req.cookies)
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