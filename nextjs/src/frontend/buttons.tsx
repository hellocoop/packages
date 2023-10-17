import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import type { ProviderHint, Scope } from '@hellocoop/utils'

import config from '../lib/config'
const { loginApiRoute } = config

export type Color = "black" | "white"
export type Theme = "ignore-light" | "ignore-dark" | "aware-invert" | "aware-static"
export type Hover = "pop" | "glow" | "flare" | "none"

const BTN_STYLES = 'https://cdn.hello.coop/css/hello-btn.css'

interface CommonButtonProps {
    label?: string
    onClick?: any //TBD type: any
    style?: any //TBD type: any
    disabled?: boolean
    showLoader?: boolean
    color?: Color
    theme?: Theme
    hover?: Hover
    targetURI?: string
    providerHint?: ProviderHint[] | string
}

export interface BaseButtonProps extends CommonButtonProps {
    scope?: Scope[] | string
    updateScope?: "email" | "picture"
}

export interface LoginButtonProps extends CommonButtonProps {
    scope?: Scope[] | string
}

export interface UpdateButtonProps extends CommonButtonProps {
    updateScope?: "email" | "picture"
}

const CLASS_MAPPING = {
    black: {
        "ignore-light": "",
        "ignore-dark": "hello-btn-black-on-dark",
        "aware-invert": "hello-btn-black-and-invert",
        "aware-static": "hello-btn-black-and-static"
    },
    white: {
        "ignore-light": "hello-btn-white-on-light",
        "ignore-dark": "hello-btn-white-on-dark",
        "aware-invert": "hello-btn-white-and-invert",
        "aware-static": "hello-btn-white-and-static"
    },
}

const HOVER_MAPPING = {
    "pop": "",
    "glow": "hello-btn-hover-glow",
    "flare": "hello-btn-hover-flare",
    "none": "hello-btn-hover-none"
}

function BaseButton({ scope, updateScope, targetURI, providerHint, label, style, color = "black", theme = "ignore-light", hover = "pop" } : BaseButtonProps) {
    const helloBtnClass = CLASS_MAPPING[color]?.[theme]

    const [clicked, setClicked] = useState(false)
    const { push } = useRouter()

    const params = new URLSearchParams()
    if(scope) {
        if(typeof scope == 'string')
            params.set("scope", scope)
        else
            params.set("scope", scope.join(" "))
    }

    targetURI = targetURI || (typeof window != 'undefined' && window.location.pathname) || ""
                             //window can be undefined when running server-side
    params.set("target_uri", targetURI)
    
    if(updateScope)
        params.set("scope", "profile_update " + updateScope)

    if(providerHint) {
        if(typeof providerHint == 'string')
            params.set("provider_hint", providerHint)
        else
            params.set("provider_hint", providerHint.join(" "))
    }

    const onClickHandler = (): void => {
        setClicked(true)
        push(loginApiRoute + "&" + params.toString())
    }

    //check if dev has added css to _document head
    const injectStylesheetInHead = typeof document != 'undefined' && !Array.from(document.head.getElementsByTagName('link')).find(
        (element) =>
            element.getAttribute('rel') === 'stylesheet' &&
            element.getAttribute('href') === BTN_STYLES
    );
    
    return (
        <>
            {injectStylesheetInHead &&
                <Head>
                    <link rel="stylesheet" href={BTN_STYLES} />
                </Head>
            }
            <button onClick={onClickHandler} disabled={clicked} style={style} className={`hello-btn ${helloBtnClass} ${HOVER_MAPPING[hover]} ${clicked ? 'hello-btn-loader' : ''}`}>
                {label}
            </button>
        </>
    )
}

export function ContinueButton(props: LoginButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Continue with Hellō" />
}

export function LoginButton(props: LoginButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Log in with Hellō" />
}

export function UpdateEmailButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update Email with Hellō" updateScope="email" style={{width: '270px'}} />
}

export function UpdatePictureButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update Picture with Hellō" updateScope="picture" style={{width: '270px'}} />
}

//TBD
// export function UpdateProfileButton() {
//     return <UpdateBaseButton label="ō&nbsp;&nbsp;&nbsp;Update Picture with Hellō" updateScope="profile" />
// }