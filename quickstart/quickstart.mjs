#!/usr/bin/env node

import semver from 'semver';
import next from './next.mjs'

const requiredVersion = '>=18.3.0';

if (!semver.satisfies(process.versions.node, requiredVersion)) {
  console.error(`This script requires Node.js version ${requiredVersion}`);
  process.exit(1);
}

// following are in Nodejs 18+
import { parseArgs } from "node:util";

if (!process.stdout.isTTY) {
    const error = new Error('Not running on interactive terminal. Exiting Hellō Quickstart.')
    console.error(error)
    process.exit(1);
}

let {
  values: { nextjs, provider_hint, suffix, wildcard, integration },
} = parseArgs({
  options: {
    nextjs: {
        type: "boolean"
    },
    provider_hint: {
        type: "string",
        short: "p",
        default: '',
    },  
    suffix: {
        type: "string",
        short: "x",
        default: '',
    },
    integration: {
        type: "string",
        short: "i",
        default: ''
    },
    wildcard: {
        type: "boolean",
        short: "w",
    }
  },
});

import quickstart from './index.js';
import dotenv from 'dotenv'

(async () => {

    if (nextjs) {
        await next({ provider_hint, suffix, integration })
        process.exit(0)
    }

    dotenv.config() // .env

    const options = {}
    if (provider_hint) 
        options.provider_hint = provider_hint
    if (suffix) 
        options.suffix = suffix
    if (integration) 
        options.integration = integration
    if (wildcard) 
        options.wildcard_domain = wildcard

    const client_id = await quickstart(options)
    console.log(`client_id=${client_id}`)
})();
