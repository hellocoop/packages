
import open from 'open'
import getPort from 'get-port'
import * as http from 'http'
import { URLSearchParams, parse } from 'url';
import page from './page.js'


const quickstart = async function (params) {
    return new Promise(async (resolve) => {

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
                    console.log(clientHTML)
                    resolve(u.query.client_id)
                })    
            })
        })

        const response_uri = `http://${host}:${port}/`
        const queryParams = {
            // TODO add in passed parameters
            response_uri,
        }
        const queryString = new URLSearchParams(queryParams).toString();
        const quickstartURL = `https://quickstart.hello.coop/?${queryString}`
        server.listen(port, host, () => {
            console.log('Obtaining a client_id from Hellō Quickstart using')
            console.log(quickstartURL)
            console.log('Opening browser...')
            open(quickstartURL)
        })
    })
}

export default quickstart;


