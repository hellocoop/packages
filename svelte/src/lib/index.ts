/// <reference types="svelte" />

//Buttons
export { default as ContinueButton } from './buttons/ContinueButton.svelte'
export { default as LoginButton } from './buttons/LoginButton.svelte'
export { default as UpdateEmailButton } from './buttons/UpdateEmailButton.svelte'
export { default as UpdatePictureButton } from './buttons/UpdatePictureButton.svelte'
export { default as UpdateTwitterButton } from './buttons/UpdateTwitterButton.svelte'
export { default as UpdateDiscordButton } from './buttons/UpdateDiscordButton.svelte'
export { default as UpdateGitHubButton } from './buttons/UpdateGitHubButton.svelte'
export { default as UpdateGitLabButton } from './buttons/UpdateGitLabButton.svelte'

//Login Status
export { default as LoggedIn } from './login-status/LoggedIn.svelte'
export { default as LoggedOut } from './login-status/LoggedOut.svelte'

//Auth
export * from './auth.js'

//Logout
export * from './logout.js'

//Provider
export { default as Provider, routeConfig, getHelloProviderContext } from './Provider.svelte'