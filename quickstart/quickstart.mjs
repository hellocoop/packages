#!/usr/bin/env node
import semver from 'semver';
import * as fs from 'fs'

const requiredVersion = '>=18.3.0';

if (!semver.satisfies(process.versions.node, requiredVersion)) {
  console.error(`This script requires Node.js version ${requiredVersion}`);
  process.exit(1);
}

// following are in Nodejs 18+
import { parseArgs } from "node:util";
import { randomBytes } from 'crypto'

if (!process.stdout.isTTY) {
    const error = new Error('Not running on interactive terminal. Exiting Hellō Quickstart.')
    console.error(error)
    process.exit(1);
}

const {
  values: { provider_hint, suffix, file, secret, wildcard, integration, debug },
} = parseArgs({
  options: {
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
    file: {
        type: "string",
        short: "f",
    },
    secret: {
        type: "boolean",
        short: "s",
    },
    wildcard: {
        type: "boolean",
        short: "w",
    },
    debug: {
        type: "boolean",
        short: "d",
    },
    },
});

import 'dotenv/config'
import quickstart from './index.js';

const existingClientId = process.env.HELLO_CLIENT_ID_DEFAULT
if (existingClientId) {
    console.error(`HELLO_CLIENT_ID_DEFAULT already set to ${existingClientId}`)
    process.exit(0);
} 

if (debug) {
    console.log('Hellō Quickstart parameters:')
    if (provider_hint)
        console.log(`  provider_hint="${provider_hint}"`)
    if (suffix)
        console.log(`  suffix="${suffix}"`)
    if (integration)
        console.log(`  integration="${integration}"`)
    if (file)
        console.log(`  writing output to "${file}"`)
    console.log(`  generate secret=${secret}`)
    console.log(`  enable wildcard=${wildcard}\n`);    
}

(async () => {

    const options = {
        suffix,
        provider_hint,
        wildcard_domain: wildcard,
        integration
    }

    const output = {}
    try {
        output.client_id = await quickstart(options)
    } catch(err) {
        console.error(err)
        process.exit(1)
    }
    if (secret)
        output.secret = randomBytes(32).toString('hex')

    if (file) {
        let helloConfig = `
# added by @hellocoop/quickstart-nextjs on ${(new Date()).toISOString()}
HELLO_CLIENT_ID_DEFAULT='${output.client_id}'`       
        if (secret) {
            helloConfig +=`
HELLO_COOKIE_SECRET_DEFAULT='${output.secret}'
`
        }
        const outputFile = process.cwd()+'/'+file

        try {
            const err = fs.appendFileSync(outputFile,helloConfig)
        } catch(err) {
            console.err(err)
            process.exit(1)
        }
        console.log(`\nUpdated ${outputFile} with:`)
        console.log(helloConfig+'\n')    
    } else {
        console.log(JSON.stringify(output,null,4))
    }

})();
