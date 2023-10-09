import React, { createContext, useContext } from 'react'
import { useAuth } from './auth'
import { NotLoggedIn } from '../lib/auth'

const HelloContext = createContext(NotLoggedIn);

const HelloProvider = ({ children, auth: passedAuth  } : any) => { //TBD any
  const auth = useAuth(passedAuth)
  return (
      <HelloContext.Provider value={auth}>
          {children}
      </HelloContext.Provider>
    )
}

const useHelloProviderContext = () => {
    return useContext(HelloContext)
};

export { HelloProvider, useHelloProviderContext }