
import open from 'open'
import getPort from 'get-port'
import readline from 'readline'
import * as http from 'http'
import { URLSearchParams, parse } from 'url';
import page from './page.js'

export const validQuickstartParams = [
    'suffix',
    'name',
    'tos_uri',
    'pp_uri',
    'image_uri',
    'dark_image_uri',
    'redirect_uri',
    'integration',
    'wildcard_domain',
    'provider_hint',
]

const quickstart = async function (params) {
    return new Promise(async (resolve) => {

        if (!process.stdout.isTTY) {
            const error = new Error('Not running on interactive terminal. Exiting Quickstart CLI')
            console.error(error)
            return error
        }
        const paramKeys = Object.keys(params || {})
        if (paramKeys) {
            paramKeys.forEach( param => {
                if (!validQuickstartParams.includes(param))
                    throw(new Error(`Invalid param:${param}`))            
            })
        }
        
        const port = await getPort()
        const host = 'localhost'

        const server = http.createServer((req, res) => {
            const u = parse(req.url,true)
            if (u.pathname != '/') {
                res.writeHead(200);
                return res.end('ok')
            }
            res.writeHead(200);

            // TBD - check for error response from quickstart.hello.coop
            
            const clientHTML = page(u.query.client_id)
            res.end(clientHTML, () => {
                server.closeAllConnections()
                server.close(() => {
                    resolve(u.query.client_id)
                })    
            })
        })

        const response_uri = `http://${host}:${port}/`
        const queryParams = {
            ... params,
            response_uri,
        }
        const queryString = new URLSearchParams(queryParams).toString();
        const quickstartURL = `https://quickstart.hello.coop/?${queryString}`
        server.listen(port, host, () => {
            console.log('Obtaining a client_id from Hellō Quickstart using:')
            console.log(quickstartURL)
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
              });
              
              rl.question('Press ENTER to open in the browser...', (answer) => {
                open(quickstartURL)
                rl.close();
              });

        })
    })
}

export default quickstart;


