// creates an authorization request URL for Hellō


const DEFAULT_SCOPE: Scope[] = ['openid','name','email','picture']
const DEFAULT_RESPONSE_TYPE: AuthResponseType = 'code'
const DEFAULT_RESPONSE_MODE: AuthResponseMode = 'form_post'
const DEFAULT_HOST: string = 'https://wallet.hello.coop'
const DEFAULT_PATH: string = '/authorization#' // note the # so we load as a fragment

import PKCE from './pkce'
import { uuid4 } from './pkce';

export const VALID_SCOPES = [
    'openid', 
    'name', 
    'nickname',
    'preferred_username',
    'given_name',
    'family_name',
    'email', 
    'phone', 
    'picture',
// Hellō extensions -- non-standard scopes
    'ethereum',
    'profile_update',
] as const;
export const VALID_RESPONSE_TYPE = ['id_token', 'code'] as const;    // Default: 'code'
export const VALID_RESPONSE_MODE = ['fragment', 'query', 'form_post'] // Default: 'form_post'
export const VaLID_PROVIDER_HINT = [
    // 'google' and 'email' are always in default
    // 'apple' added if on Apple OS
    // 'microsoft' added if on Microsoft OS
    'apple', 
    'discord',
    'facebook',
    'github',
    'gitlab',
    'twitch',
    'twitter',
    'tumblr',
    'mastodon',
    'microsoft',
    'line',
    'wordpress',
    'yahoo',
    'phone',
    'ethereum',
    'qrcode',
    // the following will remove provider from recommended list
    'apple--',
    'microsoft--',
    'google--',
    'email--',
    'passkey--',
] as const;

export type Scope = typeof VALID_SCOPES[number];
export type AuthResponseType = typeof VALID_RESPONSE_TYPE[number]; 
export type AuthResponseMode = typeof VALID_RESPONSE_MODE[number]; 
export type ProviderHint = typeof VaLID_PROVIDER_HINT[number]; 

export function isValidScope( scope: string ): boolean {
    return VALID_SCOPES.includes(scope as Scope)
}

export function areScopesValid(scopes: string[]): boolean {
    return scopes.every((scope) => isValidScope(scope));
}

export interface ICreateAuthRequest {
    client_id: string;
    redirect_uri: string;
    scope?: Scope[];
    response_type?: AuthResponseType; 
    response_mode?: AuthResponseMode;
    mock?: string;
    nonce?: string;
    state?: string;
    login_hint?: string
    provider_hint?: ProviderHint[];
}

export interface AuthenticationResponse {
    url: string;
    nonce: string;
    code_verifier: string;
}

export default async function createAuthRequest( 
        config: ICreateAuthRequest
    ): Promise<AuthenticationResponse> {
  // Ensure client_id is provided (required)
    if (!config.client_id) {
        throw new Error('client_id is required in the authorization request.');
    }
    if (!config.redirect_uri) {
        throw new Error('redirect_uri is required in the authorization request.');
    }
    // TODO check if redirect_uri is a valid URL

    // TODO check if mock is valid host or boolean

    if (config.scope) {
        if (!areScopesValid(config.scope))
            throw new Error('One or more passed scopes are invalid.');
        // add in openid scope and make unique
        config.scope = Array.from(new Set([...config.scope, 'openid']));
    }
    if (config.response_type) {
        if (!VALID_RESPONSE_TYPE.includes(config.response_type))
            throw new Error('Invalid response_type.');
    }
    if (config.response_mode) {
        if (!VALID_RESPONSE_MODE.includes(config.response_mode))
            throw new Error('Invalid response_mode.');
    }
    const nonce = config.nonce || uuid4()
    let code_verifier: string = '', code_challenge : string
    const scopeArray = config.scope || DEFAULT_SCOPE
    const scope = scopeArray.join(' ')
    const params: Record<string, any> = {
        client_id: config.client_id,
        redirect_uri: config.redirect_uri,
        scope,
        response_type: config.response_type || DEFAULT_RESPONSE_TYPE,
        response_mode: config.response_mode || DEFAULT_RESPONSE_MODE,
        nonce,
    }
    if (params.response_mode === 'code') {
        ({ code_verifier, code_challenge } = await PKCE())
        params.code_challenge = code_challenge
        params.code_challenge_method = 'S256'
    }
    if (config.provider_hint)
        params.provider_hint = config.provider_hint.join(' ')
    const url = config.mock || DEFAULT_HOST 
        + DEFAULT_PATH
        + new URLSearchParams(params).toString()
    return {
        url,
        nonce,
        code_verifier
    }
}