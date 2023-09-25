# Next.js module for Hellō

Check out our [Hellō Next.js Starter](https://github.com/hellocoop/hello-nextjs-starter) where you will be logging in with [Hellō](https://hello.coop/) in less than a minute.

To add Hellō to your Next.js application, in your project directory:

### 1) Install the package:

```
npm install @hellocoop/nextjs
```

### 2) Update your `next.config.js` with:

```
npx @hellocoop/quickstart-nextjs
```

This will launch the Hellō Quickstart web app. After logging into Hellō you will create or select an application, and the `client_id` will be returned and added to your config along with a locally generated session secret.

### 3) Create API route

### Create a `hellocoop.js` file in the `/pages/api` directory that contains:

```
export { handleAuth as default } from '@hellocoop/nextjs'
```

### 4) Add log in button

TBD

ContinueButton - provides \[ ō Continue with Hellō \]

LoginButton

UpdateEmailButton

UpdatePictureButton

UpdateProfileButton // future

logOut - function to logout

logOutRoute - string

### State

&lt;LoggedIn - display what is enclosed if logged in

&lt;LoggedOut - display what is enclosed if logged out

### User Data

useUser -

`const user = useUser()` or if you want to get certain props\
`const { name, email } = newUser()`

### Protected Routes

How will we do this?