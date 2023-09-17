import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { defaultLoginRoute } from '../lib/config'

export interface SignInButtonProps {
    loginRoute?: string
}

export default function SignInButton({ loginRoute = defaultLoginRoute }: SignInButtonProps) {
    const [clicked, setClicked] = useState(false)
    const { push } = useRouter()

    const onSignIn = () => {
        setClicked(true)

        push(loginRoute)
    }

    return (
        <button onClick={onSignIn} disabled={clicked} className={`hello-btn ${clicked ? 'hello-btn-loader' : ''}`}>
            ō&nbsp;&nbsp;&nbsp;Continue with Hellō
        </button>
    )
}
