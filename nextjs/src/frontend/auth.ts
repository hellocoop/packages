// import { useEffect } from 'react'
// import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useHelloProviderContext } from "./provider"

import config from '../lib/config'
const { authApiRoute } = config
import type { Auth } from '../lib/auth'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useAuth(): Auth | undefined {
    const { data: auth } = useSWR<Auth>(authApiRoute, fetcher)
    return auth
}

export function getAuth( passedAuth: Auth): Auth {
    const auth = passedAuth || useHelloProviderContext() || useAuth()
    return auth
}