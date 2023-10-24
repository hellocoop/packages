# Next.js module for Hellō

> This is a summary of how to use this package. See [SDK Reference | Next.js](https://www.hello.dev/documentation/sdk-reference.html#next-js) for details.

> Check out our [Hellō Next.js Starter](https://github.com/hellocoop/hello-nextjs-starter) where you will be logging in with [Hellō](https://hello.coop/) in less than a minute.

To add Hellō to your Next.js application, in your project directory:

## 1) Install the package:

```sh
npm install @hellocoop/nextjs
```

## 2) Create or update your `.env` with:

```sh
npm run quickstart
```

This will launch the Hellō Quickstart web app. After logging into Hellō you will create or select an application, and the application's`client_id` and a generated secret for encrypting cookies will be added to the local `.env` file as `HELLO_CLIENT_ID` and `HELLO_COOKIE_SECRET`. 

> You will need to add the `HELLO_CLIENT_ID` and a new `HELLO_COOKIE_SECRET` that can be generated with `npm run secret` to your deployed environments.


## 3) Create API route

Create a `hellocoop.js` file in the `/pages/api` directory that contains:

```typescript
import { pageAuth } from '@hellocoop/nextjs'
export default pageAuth({})
```

## 4) Add Hellō stylesheet

To provide the button styling, add the below code to the `<Head>` section of the `_document.tsx` file:

```html
<link rel="stylesheet" href="https://cdn.hello.coop/css/hello-btn.css"/>
```

See the [hello-nextjs-starter _document.tsx](https://github.com/hellocoop/hello-nextjs-starter/blob/main/pages/_document.tsx) for reference.

> To ensure the button styles are available, client-side rendered buttons check if the stylesheet has been included in the document head, and if not the stylesheet is injected. Injecting into the head is [not recommended](https://nextjs.org/docs/messages/no-stylesheets-in-head-component) and creates a button rendering glitch.

## 5) Add Hellō button and conditional display

```jsx
// index.jsx

import { ContinueButton, LoggedIn, LoggedOut } from "@hellocoop/nextjs"
export default function Home() {  
    return (
        <Layout>
          <LoggedIn>
              <Hero/> {/* logged in content */}
          </LoggedIn>
          <LoggedOut>
              <ContinueButton/>
          </LoggedOut>
          <Info/>
        </Layout>
    )
}    
```
## 6) Access auth data

The client side `useAuth()` function returns the `isLoading` state in addition to the auth data returned by the server side `getAuth()`

### Client side

```typescript
import { useAuth } from '@hellocoop/nextjs'


const {
    isLoading,      // useSWR response, true if still loading call to 
    isLoggedIn,     // same as in auth object, replicated for convenience
    auth: undefined | {
        isLoggedIn, // always returned
        iat,        // returned if isLoggedIn == true
        sub,        // use as user identifier - returned if isLoggedIn == true
        // additional claims - following are defaults
        name, 
        email,
        picture 
    }
} = useAuth()
```

### Server side

```typescript
import { getAuth } from '@hellocoop/nextjs'

// returns same shape as useAuth().auth
const { 
    isLoggedIn, // always returned
    iat,        // returned if isLoggedIn == true
    sub,        // use as user identifier - returned if isLoggedIn == true
    // additional properties set in auth cookie - following are defaults
    name, 
    email,
    picture 
} = await getAuth( req )
```
*This is a summary of how to use this package. See [SDK Reference | Next.js](https://www.hello.dev/documentation/sdk-reference.html#next-js) for details.*
