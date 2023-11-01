<script context="module">
  import { setContext, getContext, onMount } from 'svelte'
  
  export const routeConfig = {
      login: '/api/hellocoop?login=true',
      auth: '/api/hellocoop?auth=true',
      logout: '/api/hellocoop?logout=true',
  }
  
  export const getHelloProviderContext = () => {
      return getContext('HelloProviderContext')
  }
</script>
    
<script>
    export let auth = {}
    export let config = {}

    setContext('HelloProviderContext', auth)

    if (config?.login) routeConfig.login = config.login 
    if (config?.auth) routeConfig.auth = config.auth 
    if (config?.logout) routeConfig.logout = config.logout 
</script>
    
<slot/>