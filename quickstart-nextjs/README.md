# Hellō Quickstart CLI for Next.js

Launches the [Hellō Quickstart Web App](https://www.hello.dev/documentation/management-apis.html#quickstart-api) and saves the `client_id` and session secret in the `.env` file as `HELLO_CLIENT_ID_DEFAULT` and `HELLO_COOKIE_SECRET_DEFAULT`.

## Usage

You can get a Hellō `client_id` and session secret by running the following in your Next.js project directory:
```sh
npx @hellocoop/quickstart-nextjs@latest
```
You will be prompted to download the module, and then Hellō Quickstart will be launched.

## Bundling with Sample Apps Using Hellō 

If you are including Hellō in an Next.js sample app that others will install, then add @hellocoop/quickstart to your project with
```sh
npm i --save-dev @hellocoop/quickstart@latest
``` 
and add 
```sh
npx @hellocoop/quickstart-nextjs@latest
```
to your configuration scripts. This will get your users up and running with your sample app in seconds.