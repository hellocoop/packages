# Hellō Client Package

A collection of browser helper functions for integrating Hellō

## Installation
```bash
npm install @hellocoop/client
```
## Usage 
```typescript
import { createAuthRequest, fetchToken, parseToken, validateToken } from '@hellocoop/client'

```
# API

## createAuthRequest

### const `{ url, nonce, code_verifier } = await createAuthRequest(config)`

A helper function to create the url to load in the browser to make the request to Hellō.

```typescript
config = {
    client_id: OAuth "client_id" parameter - REQUIRED
    redirect_uri: OAuth "redirect_uri" parameter - REQUIRED
    scope?: array of zero or more scopes to request - default ['openid','name','email','picture']
    response_type?: 'id_token'|'code' - default 'code'
    response_mode?: 'fragment'|'query'|'form_post' - default 'query'
    nonce?: OpenID Connect "nonce" parameter override. 
    state?: OAuth "state" parameter
    provider_hint?: array of provider hint update values (see below)
    wallet?: alternative mock wallet URL for testing
}
```
- [supported scopes](https://www.hello.dev/documentation/hello-claims.html)
- [recommended providers](https://www.hello.dev/documentation/provider-hint.html)

Returns
```typescript
{
    url: URL to load in the browser to make the authorization request
    nonce: nonce to remember for verifying the returned ID Token
    code_verifier: returned if a "code" flow
}
```

If the request is approved the user, the `redirect_uri` will receive the response per the `response_mode` as `'fragment'|'query'|'form_post'` parameters (`query` is default). The response will be per the `response_mode` and either an `id_token` or a `code` (`code` is default).



## fetchToken
### `token = await fetchToken(config)`

A helper function to fetch an ID Token after a `code` flow. 

```typescript
config = {
    client_id: OAuth "client_id" parameter used in request - REQUIRED
    redirect_uri: OAuth "redirect_uri" parameter used in request - REQUIRED
    code_verifier: OAuth "code_verifier" created with `createAuthRequest()`
    code: OAuth "code" parameter returned from request
    wallet?: string; alternative mock wallet host for testing
} 
```

returns an ID Token in the JWT compact format (a string). Note that the ID Token does not require validation as it came directly from Hellō and is bound to the provided `code_verifier` used in the request

## parseToken
### `const { header, payload } = parseToken(token)`

Parses the header and payload from an ID Token. Does not verify the ID Token.

### Example usage

```typescript
const { url, nonce, code_verifier } = await createAuthRequest({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI // the callback endpoint
})

// store nonce & code_verifier in browser session storage

res.redirect(url) // redirect browser to make auth request
```

```typescript

const { code, error } = res.query
// process error if returned

// get nonce, code_verifier from session
try {
    const token = await fetchToken({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI, // the callback endpoint
        code_verifier,
        code
    })
    const { payload } = parseToken(token)
    if (payload.nonce !== nonce)
        // process error
    const { sub, name, email, picture } = payload
    // make use of user data
} catch (err) {
    // deal with error
}

```

## validateToken
### `const { active } = await validateToken(config)`

A helper function to validate an ID Token after a `code` flow. 

```typescript
config = {
    token: OAuth "client_id" parameter used in request - REQUIRED
    client_id: OAuth "redirect_uri" parameter used in request - REQUIRED
    nonce: OAuth "code_verifier" created with `createAuthRequest()`
    wallet?: string; alternative mock wallet host for testing
} 
```

that will examine the token, ensure it was from Hellō, has not expired, and return the payload.

No authentication is required to call the introspection endpoint. You MUST pass your `client_id`, and if you provided a nonce in the request URL, you MUST provide the nonce. The `token`, `client_id`, and optional `nonce` are sent as JSON.

### Example usage

```typescript
const response = await validateToken({
    client_id: OAuth "client_id" parameter used in request - REQUIRED,
    code_verifier: OAuth "code_verifier" created with `createAuthRequest()` - REQUIRED
    nonce: OAuth "nonce" created with `createAuthRequest()`
})
```

### Example response
If successfully validated, you will receive the ID Token payload with `active: true` to indicate it is an active token. If unsuccessful, you will receive an Introspection Error.

```json
{
  "iss": "https://issuer.hello.coop",
  "aud": "3574f001-0874-4b20-bffd-8f3e37634274",
  "nonce": "b957cea0-f159-4390-ba48-5c5d7e943ea4",
  "jti": "8ad167d1-d170-46c9-b3c6-47dda735a4e3",
  "sub": "f9e21f0f-9f0e-41b0-a58b-c2d63bcc7b4f",
  "scope": [
      "name",
      "nickname",
      "picture",
      "email",
      "openid"
  ],
  "name": "Dick Hardt",
  "nickname": "Dick",
  "picture": "https://cdn.hello.coop/images/default-picture.png",
  "email": "dick.hardt@hello.coop",
  "email_verified": true,
  "iat": 1669399110,
  "exp": 1669399410,
  "active": true
}
```

### Example error response
If the token is invalid in anyway, the API will return `active` set to `false`
```json
{
    "active":false
}
```

For more information on errors, please see [Introspection Errors](https://www.hello.dev/documentation/errors.html#introspection-errors) section on hello.dev

<!-- [API Documentation](https://www.hello.dev/documentation/sdk-reference.html#client) -->