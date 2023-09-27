'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useSWR from 'swr'

import { defaultUserApiRoute, defaultReturnToRoute } from '../lib/config'
import type { User } from '../lib/user'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function useUser(): User | undefined {
    const { data: user } = useSWR<User>(defaultUserApiRoute, fetcher)
    const { push } = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!user?.isLoggedIn) {
            push(defaultReturnToRoute)
        }
    }, [user, pathname])

    return user
}
