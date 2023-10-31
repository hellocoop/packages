import { routeConfig } from './provider'

export const getLogOutRoute = () => routeConfig.logout

export function logOut() {
    window.location.href = routeConfig.logout
}