# Next.js module for Hellō

Check out our [Hellō Next.js Starter](https://github.com/hellocoop/hello-nextjs-starter) where you will be logging in with [Hellō](https://hello.coop/) in less than a minute.

To add Hellō to your Next.js application, in your project directory:

### 1) Install the package:

```sh
npm install @hellocoop/nextjs
```

### 2) Update your `.env` with:

```sh
npx @hellocoop/quickstart-nextjs
```

This will launch the Hellō Quickstart web app. After logging into Hellō you will create or select an application, and the `client_id` and a generated session secret will be added to your `.env` file as `HELLO_CLIENT_ID_DEFAULT` and `HELLO_SESSION_SECRET_DEFAULT`. 

Include this `.env` file in your deployments.

### 3) Create API route

Create a `hellocoop.js` file in the `/pages/api` directory that contains:

```typescript
export { handleAuth as default } from '@hellocoop/nextjs'
```

### 4) Add Hellō buttons
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

#### Optional properties:
- `scope` - space separated list of [Hellō scope values](https://www.hello.dev/documentation/hello-claims.html#current-scopes). Default 'openid email name picture'.
- `targetURI` - defaults to `HELLO_DEFAULT_TARGET_ROUTE` or '/'
- `providerHint` - overrides the [recommended providers](https://www.hello.dev/documentation/provider-hint.html#recommended-provider-defaults)  

`<UpdateEmailButton/>` - provides \[ ō Update Email with Hellō \]

`<UpdatePictureButton/>` - provides \[ ō Update Picture with Hellō \]

#### Optional properties:
- `targetURI` - defaults to current page.
- `providerHint` - overrides the [recommended providers](https://www.hello.dev/documentation/provider-hint.html#recommended-provider-defaults)  


### 5) Add Log out
```typescript
import { logOut, logOutRoute } from '@hellocoop/nextjs'
```


`logOut()` - function to logout user

`logOutRoute` - provides route to logout

### 6) Use Logged In State to Select Content
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

### 7) User Data (Client Side Rendering)

```typescript
import { useUser } from '@hellocoop/nextjs'

const user = useUser()  

// or if you want specific properties
const { 
    isLoggedIn, // always returned
    sub,        // always available isLoggedIn - use as user identifier
    // claims representing requested scopes - following are defaults
    name, 
    email,
    picture 
} = useUser()
```

### 8) Environment Variables

#### Customize these variables as desired

- `HELLO_DEFAULT_SCOPE` overrides the default `'openid name email picture'` scope for login. [Possible values.](https://www.hello.dev/documentation/hello-claims.htm)
- `HELLO_PROVIDER_HINT` overrides the default [recommended providers](https://www.hello.dev/documentation/provider-hint.html) presented to your users

#### Variables that may be needed

- `HELLO_DEFAULT_TARGET_ROUTE` overrides default route '/' after login
- `HELLO_DEFAULT_LOGGED_OUT_ROUTE` overrides default route '/' after logout
- `HELLO_REDIRECT_URI` overrides dynamic redirect_uri discovery
- `HELLO_CLIENT_ID` overrides `HELLO_CLIENT_ID_DEFAULT` in `.env` set by Quickstart
- `HELLO_SESSION_SECRET` overrides `HELLO_SESSION_SECRET_DEFAULT` in `.env` set by Quickstart

#### Testing Variables

- `HELLO_DOMAIN` - overrides 'hello.coop' - used for testing by Hellō team
- `HELLO_WALLET` - overrides default 'https://wallet.hello.coop' - used if mocking Hellō server

## Server Side Rendering (SSR)

Currently only Client Side Rendering (CSR) is supported. SSR coming soon.