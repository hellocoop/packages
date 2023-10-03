# Hellō Quickstart

## CLI

You can run the following command to create or retrieve the `client_id` for a Hellō Application. 
```sh
npx @hellocoop/quickstart@latest
```

This will open up a browser window, where you will need to login with Hellō, and then choose to create a new app, or return the `client_id`.

## Import Package

This package is useful for platform specific installers such as [Hellō Quickstart for Next.js](https://www.npmjs.com/package/@hellocoop/quickstart-nextjs)

To install in another package

```sh
npm i --save-dev @hellocoop/quickstart
```

You can then use call Quickstart fom another configuration script

```javascript
import quickstart from '@hellocoop/quickstart';

...
const response_uri = 'http://localhost:8080'
const client_id = await quickstart({
    response_uri
})

```
There are many options that can be passed to Quickstart. See the [Quickstart API](https://www.hello.dev/documentation/management-apis.html#quickstart-api) for details.
