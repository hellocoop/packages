
import { Auth } from '@hellocoop/types'
import { configuration } from '@hellocoop/router'
import { cookies } from 'next/headers'
import { decryptObj } from '@hellocoop/core'
import { NotLoggedIn} from '@hellocoop/constants'

export const auth = async function (): Promise<Auth> {

    const authCookie = cookies().get(configuration.cookies.authName)?.value

console.log({authCookie})

    if (!authCookie)
        return NotLoggedIn
    const a = await decryptObj(authCookie, configuration.secret as string) as Auth

console.log({a})

    if (!a)
        return NotLoggedIn
    return a 
}