
import useSWR from 'swr'
import type { Claims } from '@hellocoop/types'

import { useHelloProviderContext, routeConfig } from "./provider"

const fetcher = async (url: string): Promise<Auth | undefined> => {
    try {
        const response = await fetch(url)
        const auth = await response.json()
        return auth
    } catch( err ) {
        console.error(err) 
        return undefined
    }
}

type AuthCookie = {
        sub: string,
        iat: number
    } & Claims & {
        [key: string]: any; // Allow arbitrary optional properties
    }

export type Auth = {
    isLoggedIn: false
} | ({
    isLoggedIn: true,
} & AuthCookie )


export type AuthState = {
    auth: Auth | {}, 
    isLoading: boolean,
    isLoggedIn: boolean | undefined
}

export const useAuth = (): AuthState => {
    const defaultAuth: Auth | undefined = useHelloProviderContext()
    const { data: auth, isLoading } = useSWR(routeConfig.auth, fetcher, {
        fallbackData: defaultAuth
    })
    return { 
        auth: auth || {}, 
        isLoading, 
        isLoggedIn: auth?.isLoggedIn }
}

