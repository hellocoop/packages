// next.js quickstart

import semver from 'semver';
import  { statSync, appendFileSync } from 'fs'
import chalk from 'chalk';
import fs from 'fs-extra'
import 'dotenv/config'
import quickstart from './index.js';
import { randomBytes } from 'crypto'

const HELLO_CONFIG_FILE = 'hello.config.js'
const HELLO_COOP_FILE = 'pages/api/hellocoop.js'
const ENV_FILE = '.env.local'

// check if @hellocoop/nextjs is installed


const writeConfig = async (options) => {
    const filePath = process.cwd()+'/'+HELLO_CONFIG_FILE
    try {
        statSync(filePath);
        console.error(`${HELLO_CONFIG_FILE} already exists at:\n${filePath}\nSkipping getting client_id`)
        return
    } catch (err) {
        if (err.code !== 'ENOENT') { // file does not exist
            throw(err)
        }
    }
    // file does not exist - let's get a client_id and write file
    options.wildcard_domain=true
    const client_id = await quickstart(options)
    const config =`// ${HELLO_CONFIG_FILE}

const config = {
    client_id: '${client_id}',
}
export default config
`
    fs.outputFileSync( filePath, config)
    console.log(`created ${filePath} with\nclient_id:${chalk.blueBright(client_id)}`)
//     console.log(
// `You can update the:
//     - Application Logo
//     - Application Name
//     - Terms of Service URL
//     - Privacy Policy URL
//     - Redirect URIs
// at the Hellō Developer Console https://console.hello.coop`)
}

const writeHelloCoop = async () => {
    const filePath = process.cwd()+'/'+HELLO_COOP_FILE
    try {
        statSync(filePath);
        console.error(`${HELLO_COOP_FILE} already exists at:\n${filePath}\nSkipping creating file`)
        return
    } catch (err) {
        if (err.code !== 'ENOENT') { // file does not exist
            throw(err)
        }
    }

    const content = `// ${HELLO_COOP_FILE}

import config from '../../hello.config.js'
import { pageAuth } from '@hellocoop/nextjs'
export default pageAuth(config)
`
    fs.outputFileSync( filePath, content )
}


const writeEnvLocal = async () => {
    const existingSecret = process.env.HELLO_COOKIE_SECRET
    if (existingSecret) {
        console.error(`HELLO_COOKIE_SECRET already set to ${existingSecret}`)
        return
    } 

    const secret = randomBytes(32).toString('hex')
    const env = `
# added by @hellocoop/quickstart --nextjs on ${(new Date()).toISOString()}
HELLO_COOKIE_SECRET='${secret}'
`
    const outputFile = process.cwd()+'/'+ENV_FILE
    appendFileSync(outputFile,env)
    console.log(`\nUpdated ${outputFile} with:`)
    console.log(chalk.blueBright(env))   
}

const next = async (options) => {
    try {
        await writeHelloCoop()
        await writeEnvLocal()
        await writeConfig(options)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

export default next






