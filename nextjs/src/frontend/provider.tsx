import React, { createContext, useContext } from 'react'

const HelloContext = createContext(undefined)

const HelloProvider = ({ children, auth } : any) => { //TBD any
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