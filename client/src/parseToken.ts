// 
// parseToken - parses an ID token and returns the header and payload
//

import { VALID_IDENTITY_CLAIMS } from './createAuthRequest'

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

// https://stackoverflow.com/a/38552302/9747630
function parseJwt (token: string): TokenHeader | TokenPayload {
    var base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload)
}

export function parseToken( token: string): { header: TokenHeader; payload: TokenPayload} {
    try {
        const [headerEncoded, tokenEncoded] = token.split('.')

        const header = parseJwt(headerEncoded) as TokenHeader
        const payload = parseJwt(tokenEncoded) as TokenPayload

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