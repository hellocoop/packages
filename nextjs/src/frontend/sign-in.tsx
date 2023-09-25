'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { apiRoute } from '../lib/config'

export interface SignInButtonProps {
    loginRoute?: string
}

export default function SignInButton({ loginRoute = apiRoute+'?login=true' }: SignInButtonProps) {
    const [clicked, setClicked] = useState(false)
    const { push } = useRouter()

    const onSignIn = () => {
        setClicked(true)

        push(loginRoute)
    }

    return (
        <button onClick={onSignIn} disabled={clicked} className={`hello-btn-black-and-static ${clicked ? 'hello-btn-loader' : ''}`}>
            ō&nbsp;&nbsp;&nbsp;Continue with Hellō
        </button>
    )
}
