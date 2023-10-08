import React, { createContext, useContext } from 'react'
import { useAuth } from './auth'

const HelloContext = createContext(null);

const HelloProvider = ({ auth, children } : any) => { //TBD any
    const u = auth || useAuth()
    return (
      <HelloContext.Provider value={u}>
        {children}
      </HelloContext.Provider>
    )
}

const useHelloProviderContext = () => {
    return useContext(HelloContext)
};

export { HelloProvider, useHelloProviderContext }