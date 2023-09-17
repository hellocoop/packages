import { useEffect } from 'react'
import { useRouter } from 'next/dist/client/router.js'
import useSWR from 'swr'

import { buildLoginRoute } from '../lib/login'
import { defaultUserApiRoute } from '../lib/config'
import type { User } from '../lib/user'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function useUser({
    redirect = true,
    userRoute = process.env.NEXT_PUBLIC_HELLO_USER_API_ROUTE as string || defaultUserApiRoute
} = {}) {
    const { data: user, mutate: mutateUser } = useSWR<User>(userRoute, fetcher)
    const { push, isReady, asPath } = useRouter()

    useEffect(() => {
        if (!user || !isReady) return

        if (!user.isLoggedIn && redirect) {
            push(buildLoginRoute({ sourceRoute: asPath }))
        }
    }, [user, isReady, asPath])

    return { user, mutateUser }
}
