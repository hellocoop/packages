// Hellō types

import { 
    VALID_IDENTITY_CLAIMS,
    VALID_SCOPES,
    VALID_RESPONSE_TYPE,
    VALID_RESPONSE_MODE,
    VALID_PROVIDER_HINT,
} from '@hellocoop/constants'


export type Scope = typeof VALID_SCOPES[number];
export type AuthResponseType = typeof VALID_RESPONSE_TYPE[number]; 
export type AuthResponseMode = typeof VALID_RESPONSE_MODE[number]; 
export type ProviderHint = typeof VALID_PROVIDER_HINT[number]; 

type IdentityClaims = typeof VALID_IDENTITY_CLAIMS[number]

// Create a type with all VALID_IDENTITY_CLAIMS properties as optional
type OptionalClaims = {
  [K in IdentityClaims]?: unknown;
};

export type Claims = OptionalClaims & { sub: string }

type AuthCookie = {
    sub: string,
    iat: number
} & Claims & {
    [key: string]: any; // Allow arbitrary optional properties
}

export type Auth = {
    isLoggedIn: false   
} | ( {
    isLoggedIn: true,
} & AuthCookie )

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
