

import * as fs from 'fs'
import { randomBytes } from 'crypto'
import quickstart from '@hellocoop/quickstart'


const qs = async function () {   

    console.log('Hellō Quickstart for Next.js ... ')

    const nextConfigFile = process.cwd()+'/next.config.js'

    // check if we are in a directory with next.config.js
    try {
        fs.accessSync(nextConfigFile,fs.constants.F_OK)
    } catch(err){
        const error = new Error('Could not find "next.config.js". Are we running in a Next.js project?')
        console.error(error)
        return error    
    }

    // make sure we can read and write
    try {
        fs.accessSync(nextConfigFile,fs.constants.R_OK | fs.constants.W_OK)
    } catch(err){
        const error = new Error('Do not have read and write access to "next.config.js".')
        console.error(error)
        return error    
    }

    // check that the values have not already been set
    try {
        const nextConfig = await import(nextConfigFile)
        const client_id = nextConfig?.default?.env?.HELLOCOOP_CLIENT_ID_DEFAULT
        if (client_id) {
            console.log(`HELLOCOOP_CLIENT_ID_DEFAULT already configured as ${client_id}`)
            return
        }
        console.log(JSON.stringify(nextConfig,null,4))
    } catch(err) {
        console.error('Error importing the package:', error);
        return error 
    }

    const client_id = await quickstart() // TODO set some defaults

    const session_secret = randomBytes(32).toString('hex')
    const helloConfig = `
        // added by @hellocoop/quickstart-nextjs
        nextConfig.env = {
            ...nextConfig.env,
            HELLOCOOP_CLIENT_ID_DEFAULT: '${client_id}',
            HELLOCOOP_SESSION_SECRET_DEFAULT: '${session_secret}'
        }
    `
    try {
        const err = fs.appendFileSync(nextConfigFile,helloConfig)
    } catch(err) {
        console.err(err)
        return err
    }
    console.log('Updated next.config.js with:')
    console.log(`HELLOCOOP_CLIENT_ID_DEFAULT:'${client_id}'`)
    console.log(`HELLOCOOP_SESSION_SECRET_DEFAULT: '${session_secret}'`)
    return
}

export default qs;


