import { routeConfig } from './Provider.svelte'

export const getLogOutRoute = () => routeConfig.logout

export function logOut() {
    window.location.href = routeConfig.logout
}