import { HelloRequest, HelloResponse } from '../types'
import { decode, Header, Signature } from 'jws'
import config from '../lib/config'

const handleSecevent = async (req: HelloRequest, res: HelloResponse) => {
    const event: string = req.body
    if (!event) {
        res.status(400)
        res.send('Missing event')
        return
    }
    const { header, payload } = decode(event) as Signature
    // TBD - check header and payload before verification

    console.log('secevent', { header, payload })

    res.status(200)
    res.send('OK')
}

export default handleSecevent