export type RouteConfig = {
    login: string
    auth: string
    logout: string
}
export const routeConfig: RouteConfig = {
    login: '/api/hellocoop?login=true',
    auth: '/api/hellocoop?auth=true',
    logout: '/api/hellocoop?logout=true'
}