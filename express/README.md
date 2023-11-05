# Express package for Hellō

[Hellō](https://hello.dev) is an identity network that provides login and registration using the standard OpenID Connect protocol. Hellō offers your users choice between all popular social login providers.

This [Express](https://expressjs.com/) package provides an endpoint that handles all protocol interactions and sets an encrypted cookie with the logged in user's information. The cookie contents are decrypted and available as `req.getAuth()`.

See the [Express Quickstart documentation](https://www.hello.dev/docs/quickstarts/express) for how to add Hellō to your Express app in minutes, and the [Express SDK documentation](https://www.hello.dev/docs/sdks/express) for details.
