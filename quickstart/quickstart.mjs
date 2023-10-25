#!/usr/bin/env node
import semver from 'semver';
import * as fs from 'fs'
import chalk from 'chalk';

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

const existingClientId = process.env.HELLO_CLIENT_ID
if (existingClientId) {
    console.error(`HELLO_CLIENT_ID already set to ${existingClientId}`)
    process.exit(0);
} 

const options = {}

debug && console.log('Hellō Quickstart parameters:')
if (provider_hint) {
    options.provider_hint = provider_hint
    debug && console.log(`  provider_hint="${provider_hint}"`)
}
if (suffix) {
    options.suffix = suffix
    debug && console.log(`  suffix="${suffix}"`)
}
if (integration) {
    options.integration = integration
    debug && console.log(`  integration="${integration}"`)
}
if (file) {
    debug && console.log(`  writing output to "${file}"`)
}
if (wildcard) {
    options.wildcard = wildcard
    debug && console.log(`  enable wildcard=${wildcard}\n`);    
}    

debug && console.log(`  generate secret=${secret}`);


(async () => {

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
HELLO_CLIENT_ID='${output.client_id}'`       
        if (secret) {
            helloConfig +=`
HELLO_COOKIE_SECRET='${output.secret}'
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
        console.log(chalk.blueBright(helloConfig))    
        console.log(`
You can update the:
    - Application Logo
    - Application Name
    - Terms of Service URL
    - Privacy Policy URL
    - Redirect URIs
at the Hellō Developer Console https://console.hello.coop
        `)
    }

})();
