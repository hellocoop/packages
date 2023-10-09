
import useSWR from 'swr'
import config from '../lib/config'
const { authApiRoute } = config
import { Auth, NotLoggedIn } from '../lib/auth'

const fetcher = async (url: string): Promise<Auth> => {
    const response = await fetch(url)
    const auth = response.json()
    return auth

}

export const useAuth = (passedAuth?: Auth): Auth => {
    const { data: auth } = useSWR(authApiRoute, fetcher, {
        fallbackData: passedAuth || NotLoggedIn
    })
    return auth
}

