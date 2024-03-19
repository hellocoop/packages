export type { 
    Config as HelloConfig, 
    LoginTriggerParams, 
    LoginTriggerResponse, 
    CallbackRequest, 
    CallbackResponse 
} from '@hellocoop/router'
export type { Auth } from '@hellocoop/types'

// pageAuth is synonym for pagesAuth
export { getAuth, getServerSideProps, pageAuth, pagesAuth } from './pages'
// app router functions
export { appAuth } from './app'
export { auth } from './auth'
