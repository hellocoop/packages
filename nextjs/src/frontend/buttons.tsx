import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import type { ProviderHint, Scope } from '@hellocoop/types'
import { Button } from '@hellocoop/types'

import { routeConfig } from './provider'

interface CommonButtonProps {
    label?: string
    onClick?: any //TBD type: any
    style?: any //TBD type: any
    disabled?: boolean
    showLoader?: boolean
    color?: Button.Color
    theme?: Button.Theme
    hover?: Button.Hover
    targetURI?: string
    providerHint?: ProviderHint[] | string
}

export interface BaseButtonProps extends CommonButtonProps {
    scope?: Scope[] | string
    updateScope?: Button.UpdateScope
}

export interface LoginButtonProps extends CommonButtonProps {
    scope?: Scope[] | string
}

export interface UpdateButtonProps extends CommonButtonProps {
    updateScope?: Button.UpdateScope
}


function BaseButton({ scope, updateScope, targetURI, providerHint, label, style, color = "black", theme = "ignore-light", hover = "pop" } : BaseButtonProps) {
    const helloBtnClass = Button.CLASS_MAPPING[color]?.[theme]

    const [clicked, setClicked] = useState(false)
    const { push } = useRouter()

    // newURL only accepts absolute urls
    // 2nd arg is no-op if routeConfig.login is an absolute url
    const loginRoute = new URL(routeConfig.login, window.location.origin)

    if(scope) {
        if(typeof scope == 'string')
            loginRoute.searchParams.set("scope", scope)
        else
            loginRoute.searchParams.set("scope", scope.join(" "))
    }

    targetURI = targetURI || (typeof window != 'undefined' && window.location.pathname) || ""
                             //window can be undefined when running server-side
    loginRoute.searchParams.set("target_uri", targetURI)
    
    if(updateScope)
        loginRoute.searchParams.set("scope", "profile_update " + updateScope)

    if(providerHint) {
        if(typeof providerHint == 'string')
            loginRoute.searchParams.set("provider_hint", providerHint)
        else
            loginRoute.searchParams.set("provider_hint", providerHint.join(" "))
    }

    const onClickHandler = (): void => {
        setClicked(true)
        push(loginRoute)
    }

    //check if dev has added css to _document head
    const injectStylesheetInHead = typeof document != 'undefined' && !Array.from(document.head.getElementsByTagName('link')).find(
        (element) =>
            element.getAttribute('rel') === 'stylesheet' &&
            element.getAttribute('href') === Button.STYLES_URL
    );
    
    return (
        <>
            {injectStylesheetInHead &&
                <Head>
                    <link rel="stylesheet" href={Button.STYLES_URL} />
                </Head>
            }
            <button onClick={onClickHandler} disabled={clicked} style={style} className={`hello-btn ${helloBtnClass} ${Button.HOVER_MAPPING[hover]} ${clicked ? 'hello-btn-loader' : ''}`}>
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
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update Email with Hellō" updateScope="email" style={{width: '275px'}} />
}

export function UpdatePictureButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update Picture with Hellō" updateScope="picture" style={{width: '275px'}} />
}

export function UpdateDiscordButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update Discord with Hellō" updateScope="discord" style={{width: '275px'}} />
}

export function UpdateTwitterButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update Twitter with Hellō" updateScope="twitter" style={{width: '275px'}} />
}

export function UpdateGitHubButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update GitHub with Hellō" updateScope="github" style={{width: '275px'}} />
}

export function UpdateGitLabButton(props: UpdateButtonProps) {
    return <BaseButton {...props} label="ō&nbsp;&nbsp;&nbsp;Update GitLab with Hellō" updateScope="gitlab" style={{width: '275px'}} />
}

//TBD
// export function UpdateProfileButton() {
//     return <UpdateBaseButton label="ō&nbsp;&nbsp;&nbsp;Update Picture with Hellō" updateScope="profile" />
// }