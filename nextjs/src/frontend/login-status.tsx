import { getAuth } from "./auth"
import type { Auth } from '../lib/auth'

export function LoggedIn({ auth, children }: {auth:Auth, children:any}) { //TBD type: any
    const u = getAuth(auth)
    if (u?.isLoggedIn)
        return children
}

export function LoggedOut({ auth, children }: {auth:Auth, children:any}) { //TBD type: any
    const u = getAuth(auth)
    if (!u?.isLoggedIn)
        return children
}