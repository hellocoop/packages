// 
// parseToken - parses an ID token and returns the header and payload
//

import { VALID_IDENTITY_CLAIMS } from './createAuthRequest'
import jwt_decode from "jwt-decode"

type IdentityClaims = typeof VALID_IDENTITY_CLAIMS[number]

// Create a type with all VALID_IDENTITY_CLAIMS properties as optional
type OptionalClaims = {
  [K in IdentityClaims]?: unknown;
};

export type Claims = OptionalClaims & { sub: string }

export type TokenPayload = OptionalClaims & {
    iss: string;
    aud: string;
    nonce: string;
    jti: string;
    sub: string;
    scope: string[];
    iat: number,
    exp: number,                   
}

export type TokenHeader = {
    typ: string;
    alg: string;
}

export function parseToken( token: string): { header: TokenHeader; payload: TokenPayload} {
    try {
        const header: TokenHeader = jwt_decode(token, { header: true })
        const payload: TokenPayload = jwt_decode(token)

        // TODO - check valid typ header 
        // check there is an exp claim

        return {
            header,
            payload
        }
    } catch(error: any) {
        throw new Error(error)
    }
}