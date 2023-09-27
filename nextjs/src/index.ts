import * as config from './lib/config'

console.log(JSON.stringify(config,null,4))

export { handleAuth } from './handlers/auth'
export { getUser } from './lib/user'
export { default as useUser } from './frontend/user'
export * from './frontend/buttons'
export * from './frontend/login-status'
export * from './frontend/logout'

export type { User } from './lib/user'
