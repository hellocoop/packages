# Next.js module for Hellō

##  NOTE - the Next.js SDK API is under development and will change

Check out our [Hellō Next.js Starter](https://github.com/hellocoop/hello-nextjs-starter) where you will be logging in with [Hellō](https://hello.coop/) in less than a minute.

To add Hellō to your Next.js application, in your project directory:

## 1) Install the package:

```sh
npm install @hellocoop/nextjs
```

## 2) Update your `.env` with:

```sh
npx @hellocoop/quickstart-nextjs
```

This will launch the Hellō Quickstart web app. After logging into Hellō you will create or select an application, and the `client_id` and a generated session secret will be added to your `.env` file as `HELLO_CLIENT_ID_DEFAULT` and `HELLO_SESSION_SECRET_DEFAULT`.

Include this `.env` file in your deployments.

## 3) Create API route

Create a `hellocoop.js` file in the `/pages/api` directory that contains:

```typescript
import HelloAuth from '@hellocoop/nextjs'
export default HelloAuth({})
```

## 4) Add Hellō buttons

```typescript
import { // only import buttons used
    ContinueButton, 
    LoginButton, 
    UpdateEmailButton, 
    UpdatePictureButton 
} from '@hellocoop/nextjs'
```

`<ContinueButton/>` - provides \[ ō Continue with Hellō \]

`<LoginButton/>` - provides \[ ō Login with Hellō \]

### Optional properties:

- `scope` - space separated list of [Hellō scope values](https://www.hello.dev/documentation/hello-claims.html#current-scopes). Default 'openid email name picture'.
- `targetURI` - defaults to `HELLO_DEFAULT_TARGET_ROUTE` or '/'
- `providerHint` - overrides the [recommended providers](https://www.hello.dev/documentation/provider-hint.html#recommended-provider-defaults)

`<UpdateEmailButton/>` - provides \[ ō Update Email with Hellō \]

`<UpdatePictureButton/>` - provides \[ ō Update Picture with Hellō \]

### Optional properties:

- `targetURI` - defaults to current page.
- `providerHint` - overrides the [recommended providers](https://www.hello.dev/documentation/provider-hint.html#recommended-provider-defaults)

### Optional button styling properties:
- `color` - white | black
- `theme` - ignore-light | ignore-dark | aware-invert | aware-static
- `hover` - pop | glow | flare | none

Explore styling with the [button playground](https://www.hello.dev/documentation/getting-started.html#_2-standard-hello-buttons)

## 5) Add Log out

```typescript
import { logOut, logOutRoute } from '@hellocoop/nextjs'
```

`logOut()` - function to logout user

`logOutRoute` - provides route to logout

## 6) Use Logged In State to Select Content

```tsx
import { LoggedIn, LoggedOut } from '@hellocoop/nextjs'
```

```html
<LoggedIn>
    <b>content displayed if logged in</b>
</LoggedIn>
```

```html
<LoggedOut>
    <i>content displayed if logged out</i>
</LoggedOut>
```

## 7) Auth Data - Client Side

```typescript
import { getAuth } from '@hellocoop/nextjs'

const { 
    isLoggedIn, // always returned
    iat,        // returned if isLoggedIn == true
    sub,        // use as user identifier - returned if isLoggedIn == true
    // additional properties set in auth cookie - following are defaults
    name, 
    email,
    picture 
} = getAuth()
```

## 8) Auth Data - Server Side

```typescript
import { getServerAuth } from '@hellocoop/nextjs'

// returns same shape as getAuth()
const { 
    isLoggedIn, // always returned
    iat,        // returned if isLoggedIn == true
    sub,        // use as user identifier - returned if isLoggedIn == true
    // additional properties set in auth cookie - following are defaults
    name, 
    email,
    picture 
} = await getServerAuth( req )
```


## 8) Server Side Properties 
```ts
// MyPage.tsx
import { HelloProvider, LoggedIn, LoggedOut, ContinueButton } from '@/hellocoop-nextjs'
export default function MyPage = ({auth}) {
    const { name } = auth
    return(
        <HelloProvider>
          <LoggedIn>
            Hellō {name}
          </LoggedIn>
          <LoggedOut>
            <ContinueButton/>
          </LoggedOut>
        </HelloProvider>
    )
}
// This a convenience wrapper around `getServerAuth()`
export { getServerSideProps } from '@/hellocoop-nextjs'
```

## 8) Configuration

```typescript
// /api/hellocoop.ts
import loggedIn from './your-logged-in-logic' 

import HelloAuth from '@hellocoop/nextjs'
export default HelloAuth({
    scope: ['email','name','picture'],
    callbacks: {
        async loggedIn({ token, payload }) {
            return true
        }
    },
    pages: {
        loggedIn: '/',
        loggedOut:'/',
        error:  '/auth/error',       // Error code passed in query string as ?error=
    }
})
```

## 9) Add loggedIn Logic

```typescript
import type { LoggedInParams, LoggedInResponse } from '@hellocoop/nextjs'

interface LoggedInParams

export default async loggedin ({ token, payload, req, res }:LoggedInParams): Promise<LoggedInResponse> {
    // store ID Token for audit
    await save(token)
    //
    { sub: id } = payload
    const user = async readDB(id)
    // Decide not to login user - no auth cookie set - redirected to error page
    if (payload.sub != allowedUser) 
        return {loggedIn:false}
    // Decide not to login user - no auth cookie set - process response directly
    if (payload.sub != allowedUser) {
        res.end(ErrorResponse)
        return {
            loggedIn: false
            processed: true
        }
    }

    // choose what to store in auth cookie
    return { auth: { email, name, picture }} = payload  // default values

    // process response 
    res.end(LoggedInPage)
    return { processed: true,
        auth: { email, name, picture } = payload
    }
} 

```


## 8) Environment Variables

### Production variable to be set

- `HELLO_SESSION_SECRET` overrides `HELLO_SESSION_SECRET_DEFAULT` in `.env` set by Quickstart. 

This variable should be different from development. 

### Variables that may be needed

- `HELLO_REDIRECT_URI` overrides dynamic redirect_uri discovery
- `HELLO_CLIENT_ID` overrides `HELLO_CLIENT_ID_DEFAULT` in `.env` set by Quickstart

### Testing Variables

- `HELLO_DOMAIN` - overrides 'hello.coop' - used for testing by Hellō team
- `HELLO_WALLET` - overrides default 'https://wallet.hello.coop' - used if mocking Hellō server

## Server Side Rendering (SSR)

Currently only Client Side Rendering (CSR) is supported. SSR coming soon.
