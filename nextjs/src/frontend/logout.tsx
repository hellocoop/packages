import { useRouter } from "next/router";
import { getLogoutApiRoute } from '../lib/config'

export function logOut() {
    const { push } = useRouter()
    push(getLogoutApiRoute())
}