import { IronSessionData } from 'iron-session'

export type HelloClaims = {
    iss: string,
    aud: string,
    nonce: string,
    jti: string,
    sub: string,
    scope: string[],
    iat: number,
    exp: number
    name?: string,
    nickname?: string,
    picture?: string,
    email?: string,
    email_verified?: boolean,
}

export type User = {
    isLoggedIn: false
} | ({
    isLoggedIn: true
} & HelloClaims)

export interface GetUserOptions {
    session: IronSessionData
}

export const getUser = ({ session }: GetUserOptions) => {
    return session.user
}
