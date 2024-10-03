// Third Party Initiated Login
// https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin

import { HelloRequest, HelloResponse } from '../types'
import handleLogin from './login'
import config from '../lib/config'

const initiateLogin = async (req: HelloRequest, res: HelloResponse) => {
    const { iss, login_hint, target_link_uri } = req.query

    const issuer = `https://issuer.${config.helloDomain}`
    if (iss !== issuer) {
        return res.send(`Passed iss '${iss}' must be '${issuer}'`)
    }
    req.query = {
        login_hint,
        target_uri: target_link_uri,
    }
    return handleLogin(req, res)
}

export default initiateLogin