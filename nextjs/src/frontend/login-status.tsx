import { useHelloProviderContext } from "./provider"

const isLoggedIn = (): boolean => useHelloProviderContext()?.isLoggedIn || false

export function LoggedIn({ children }: { children:any }) { //TBD type: any
    if (isLoggedIn())
        return children
}

export function LoggedOut({ children }: { children:any }) { //TBD type: any
    if (!isLoggedIn())
        return children
}