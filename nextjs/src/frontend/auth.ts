
import useSWR from 'swr'
import config from '../lib/config'
const { authApiRoute } = config
import { Auth, NotLoggedIn } from '../lib/auth'
import { useHelloProviderContext } from "./provider"

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

export type UseAuth = {
    auth: Auth | {}, 
    isLoading: boolean,
    isLoggedIn: boolean | undefined
}

export const useAuth = (): UseAuth => {
    const defaultAuth: Auth | undefined = useHelloProviderContext()
    const { data: auth, isLoading } = useSWR(authApiRoute, fetcher, {
        fallbackData: defaultAuth
    })
    return { 
        auth: auth || {}, 
        isLoading, 
        isLoggedIn: auth?.isLoggedIn }
}

