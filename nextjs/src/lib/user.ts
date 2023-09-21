import { IronSessionData } from 'iron-session'

// export type HelloClaims = {
//     iss: string,
//     aud: string,
//     nonce: string,
//     jti: string,
//     sub: string,
//     scope: string[],
//     iat: number,
//     exp: number
//     name?: string,
//     nickname?: string,
//     picture?: string,
//     email?: string,
//     email_verified?: boolean,
// }

import { TokenPayload } from '@hellocoop/utils'

export type User = {
    isLoggedIn: false
} | ({
    isLoggedIn: true
} & TokenPayload)

export interface GetUserOptions {
    session: IronSessionData
}

export const getUser = ({ session }: GetUserOptions) => {
    return session.user
}
