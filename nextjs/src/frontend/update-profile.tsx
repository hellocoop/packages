import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { defaultLoginRoute } from '../lib/config'

export interface UpdateProfileButtonProps {
    loginRoute?: string
}

export default function UpdateProfileButton({ loginRoute = defaultLoginRoute }: UpdateProfileButtonProps) {
    const [clicked, setClicked] = useState(false)
    const { push, asPath } = useRouter()

    const onSignIn = () => {
        setClicked(true)
        push(loginRoute + '?' + new URLSearchParams({
            sourceRoute: asPath,
            updateProfile: true.toString()
        }))
    }

    return (
        <button onClick={onSignIn} disabled={clicked} className={`hello-btn hello-btn-white-and-static ${clicked ? 'hello-btn-loader' : ''}`}>
            ō&nbsp;&nbsp;&nbsp;Update Profile with Hellō
        </button>
    )
}
