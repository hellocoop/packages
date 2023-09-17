import { NextApiHandler } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'

import type { Config } from '../lib/config'

const withHelloApiRouteFactory = (config: Config) =>
    (handler: NextApiHandler): NextApiHandler => withIronSessionApiRoute(handler, config.sessionOptions)

export default withHelloApiRouteFactory
