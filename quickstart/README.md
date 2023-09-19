# Hellō Quickstart

## CLI

You can run the following command to create or retrieve the `client_id` for a Hellō Application. 

`npx @hellocoop/quickstart@latest`

This will open up a browser window, where you will need to login with Hellō, and then choose to create a new app, or return the `client_id`.

## Import Package

To install in another package

`npm i @hellocoop/quickstart`

or 

`yarn i @hellocoop/quickstart`

You can then use call Quickstart fom another configuration script

```
import quickstart from './quickstart.js';

...

const client_id = await quickstart()

```

## Options

TBD