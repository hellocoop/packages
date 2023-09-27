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

export async function parseToken( token: string): Promise<{ header: TokenHeader; payload: TokenPayload}> {

    const [headerEncoded,tokenEncoded] = token.split('.')
    const headerJSON = atob(headerEncoded.replace(/-/g,'+').replace(/_/g,'/'))
    const payloadJSON = atob(tokenEncoded.replace(/-/g,'+').replace(/_/g,'/'))
    try {
        const header = await JSON.parse(headerJSON)
        const payload = await JSON.parse(payloadJSON)

        // TODO - check valid typ header 

        // check there is an exp claim

console.log({header,payload})


        return {
            header,
            payload
        }
    
    } catch(error: any) {
        throw new Error(error);
    }

}