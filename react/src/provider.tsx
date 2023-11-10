import React, { createContext, useContext } from 'react'

export type RouteConfig = {
    login: string
    auth: string
    logout: string
}
export const routeConfig: RouteConfig = {
    login: '/api/hellocoop?login=true',
    auth: '/api/hellocoop?auth=true',
    logout: '/api/hellocoop?logout=true',
}


const HelloContext = createContext(undefined)

const HelloProvider = ({ children, status, config} : any) => { //TBD any
    if (config?.login) routeConfig.login = config.login 
    if (config?.auth) routeConfig.auth = config.auth 
    if (config?.logout) routeConfig.logout = config.logout 
    return (
      <HelloContext.Provider value={status}>
          {children}
      </HelloContext.Provider>
    )
}

const useHelloProviderContext = () => {
    return useContext(HelloContext)
};

export { HelloProvider, useHelloProviderContext }