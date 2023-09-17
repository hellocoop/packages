import getConfig, { Config } from './lib/config'
import handleAuthFactory from './handlers/auth'
import handleLoginFactory from './handlers/login'
import handleLogoutFactory from './handlers/logout'
import handleCallbackFactory from './handlers/callback'
import handleUserFactory from './handlers/user'
import { default as withHelloApiFactory } from './wrappers/api'
import { default as withHelloSsrFactory } from './wrappers/ssr'

import type { NextApiHandler } from 'next'

interface HelloInstance {
    handleAuth: NextApiHandler,
    handleLogin: NextApiHandler,
    handleLogout: NextApiHandler,
    handleCallback: NextApiHandler,
    handleUser: NextApiHandler,
    withHelloApi: ReturnType<typeof withHelloApiFactory>,
    withHelloSsr: ReturnType<typeof withHelloSsrFactory>
}

let instance: HelloInstance

export const initHello = (config?: Partial<Config>): HelloInstance => {
    const mergedConfig = getConfig(config)

    const handleLogin = handleLoginFactory(mergedConfig)
    const handleLogout = handleLogoutFactory(mergedConfig)
    const handleCallback = handleCallbackFactory(mergedConfig)
    const handleUser = handleUserFactory(mergedConfig)

    const handleAuth = handleAuthFactory({
        handleLogin,
        handleLogout,
        handleCallback,
        handleUser
    }, mergedConfig)

    const withHelloApi = withHelloApiFactory(mergedConfig)
    const withHelloSsr = withHelloSsrFactory(mergedConfig)

    return {
        handleAuth,
        handleLogin,
        handleLogout,
        handleCallback,
        handleUser,
        withHelloApi,
        withHelloSsr
    }
}

const getInstance = (): HelloInstance => {
    if (instance) {
        return instance
    }
    instance = initHello()
    return instance
}

export const {
    handleAuth,
    handleLogin,
    handleLogout,
    handleCallback,
    handleUser,
    withHelloApi,
    withHelloSsr
} = getInstance()

export { getUser } from './lib/user'
export { default as useUser } from './frontend/user'
export { default as SignInButton } from './frontend/sign-in'
export { default as UpdateProfileButton } from './frontend/update-profile'

export type { User } from './lib/user'
