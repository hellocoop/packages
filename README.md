# Hellō Packages

This is a monorepo of packages for developing and integrating [Hellō](https://hello.dev)

## [quickstart-nextjs](./quickstart-nextjs/)

A CLI and nodejs module for adding Hellō to a Next.js app.

```sh
npx @hellocoop/quickstart-nextjs
```
## [nextjs](./nextjs/)

A Next.js package for login and registration with Hellō.

```sh
npm i @hellocoop/nextjs
```
## [quickstart](./quickstart/)

A CLI and nodejs module to create or retrieve a Hellō `client_id`. [Quickstart API Documentation](https://www.hello.dev/documentation/management-apis.html#quickstart-api)
```sh
npx @hellocoop/quickstart
```

## [utils](./utils/)

A set of utility functions to create an authorization request and retrieve a token payload with the authorization code. Defaults to using a code flow with PKCE and no client secret. 
```sh
npm i @hellocoop/utils
```

