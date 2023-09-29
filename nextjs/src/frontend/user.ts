'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useSWR from 'swr'

import { userApiRoute, defaultTargetRoute } from '../lib/config'
import type { User } from '../lib/user'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function useUser(): User | undefined {
    const { data: user } = useSWR<User>(userApiRoute, fetcher)
    const { push } = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (user && !user?.isLoggedIn) {
            push(defaultTargetRoute)
        }
    }, [user, pathname])

    return user
}
