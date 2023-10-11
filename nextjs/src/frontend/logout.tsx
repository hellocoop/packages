import { useRouter } from "next/router";
import config from '../lib/config'
const { logoutApiRoute } = config
export const logOutRoute = logoutApiRoute

export function logOut() {
    const { push } = useRouter()
    push(logoutApiRoute)
}