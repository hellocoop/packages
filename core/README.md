# Hellō Core Package

```typescript
import { createAuthRequest, fetchToken, parseToken } from '@hellocoop/core'

```

## createAuthRequest

### `{ url, nonce, code_verifier } = await createAuthRequest(config)`

A convenience function to creates the url to load in the browser to make the request to Hellō.

```typescript
config = {
    client_id: OAuth "client_id" parameter - REQUIRED
    redirect_uri: OAuth "redirect_uri" parameter - REQUIRED
    scope?: Scope[]; zero or more scopes to request - default ['openid','name','email','picture']
    response_type?: 'id_token'|'code' - default 'code'
    response_mode?: 'fragment'|'query'|'form_post' - default 'query'
    nonce?: string; OpenID Connect "nonce" parameter override. 
    state?: string; OAuth "state" parameter
    provider_hint?: Update recommended providers (see below)
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

If the request is approved the the user, the `redirect_uri` will receive the response per the `response_mode` as `'fragment'|'query'|'form_post'` parameters (`query` is default). The response will be per the `response_mode` and either an `id_token` or a `code` (`code` is default).



## fetchToken
### `token = await fetchToken(config)`

A convenience function to fetch an ID Token after a `code` flow. 

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
### `{ header, payload } = parseToken(token)`

Parses the header and payload from an ID Token. Does not verify the ID Token.

### Example usage

```typescript
// login page

const { url, nonce, code_verifier } = await createAuthRequest({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI // the callback endpoint
})

// store nonce & code_verifier in session storage

res.redirect(url) // redirect browser to make auth request
```

```typescript
// callback endpoint

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
    const {payload} = parseToken(token)
    if (payload.nonce !== nonce)
        // process error
    { sub, name, email, picture } = payload
    // make use of user data
} catch (err) {
    // deal with error
}

```