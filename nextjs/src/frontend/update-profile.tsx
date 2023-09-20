'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { defaultLoginRoute } from '../lib/config'

export interface UpdateProfileButtonProps {
    loginRoute?: string
}

export default function UpdateProfileButton({ loginRoute = defaultLoginRoute }: UpdateProfileButtonProps) {
    const [clicked, setClicked] = useState(false)
    const { push } = useRouter()
    const pathname = usePathname()

    const onSignIn = () => {
        setClicked(true)
        push(loginRoute + '?' + new URLSearchParams({
            sourceRoute: pathname,
            updateProfile: true.toString()
        }))
    }

    return (
        <button onClick={onSignIn} disabled={clicked} className={`hello-btn hello-btn-white-and-static ${clicked ? 'hello-btn-loader' : ''}`}>
            ō&nbsp;&nbsp;&nbsp;Update Profile with Hellō
        </button>
    )
}
