import { useRouter } from "next/router";
import { routeConfig } from './provider'

export function logOut() {
    const { push } = useRouter()
    push(routeConfig.logout)
}