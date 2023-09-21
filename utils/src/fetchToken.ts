// fetches an ID token from Hellō given the code and code_verifier

import { DEFAULT_HOST, VALID_IDENTITY_CLAIMS } from './createAuthRequest'
const DEFAULT_ENDPOINT: string = '/oauth/token'

type IdentityClaims = typeof VALID_IDENTITY_CLAIMS[number]

// Create a type with all VALID_IDENTITY_CLAIMS properties as optional
type OptionalClaims = {
  [K in IdentityClaims]?: unknown;
};


export type Payload = OptionalClaims & {
    iss: string;
    aud: string;
    nonce: string;
    jti: string;
    sub: string;
    scope: string[];
    iat: number,
    exp: number,                   
}

export type FetchConfig = {
    code: string;
    code_verifier: string;
    client_id: string;
    redirect_uri: string;
    mock?: string;
}

export async function fetchToken(
        { code, code_verifier, client_id, redirect_uri }: FetchConfig 
    ): Promise<Payload> {

    const params: Record<string, any> = {
        code,
        code_verifier,
        client_id,
        redirect_uri
    }
    const body = new URLSearchParams(params).toString()
    const tokenEndpoint = DEFAULT_HOST+DEFAULT_ENDPOINT

    try {

// TODO -- fetch is not found -- where is the type declared? review what Thomas did

        // const r = await fetch(tokenEndpoint, { // todo - adjust to deal with mock
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        //         body
        //     })   // .then((r) => r.json())

        const payload: Payload ={
            iss: '',
            aud: '',
            nonce: '',
            jti: '',
            sub: '',
            scope: [''],
            iat: 0,
            exp: 0                    
        }
        return payload
    } catch (error: any) {
        throw new Error (error)
    }
}