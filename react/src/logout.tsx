import { routeConfig } from './provider'

export const getLogOutRoute = () => routeConfig.logout

export function logOut() {
    if (typeof window !== 'undefined') window.location.href = routeConfig.logout
}