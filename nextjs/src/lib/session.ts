import type { IronSessionOptions } from 'iron-session'

import type { User } from './user'

// type of req.session.*
declare module 'iron-session' {
    interface IronSessionData {
        user?: User,
        nonce?: string,
        sourceRoute?: string
    }
}
