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

`<UpdateEmailButton/>` - provides \[ ō Update email with Hellō \]

`<UpdatePictureButton/>` - provides \[ ō Update picture with Hellō \]

### 5) Add Log out
```typescript
import { LogOut, LogOutRoute } from '@hellocoop/nextjs'
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

### User Data (Client Side Rendering)

```typescript
import { useUser } from '@hellocoop/nextjs'

const user = useUser()  
// or if you want specific properties
const { name, email } = newUser()
```
