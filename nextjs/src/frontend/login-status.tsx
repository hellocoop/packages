'use client'

import useUser from "./user"

export function LoggedIn({ children }: any) { //TBD type: any
    const user = useUser()
    if(!user?.isLoggedIn)
        return
    return children
}

export function LoggedOut({ children }: any) { //TBD type: any
    const user = useUser()
    if(user?.isLoggedIn)
        return
    
    return children
}