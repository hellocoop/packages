<script lang="ts">
  import { routeConfig } from "../Provider.svelte"
  import type { ProviderHint, Scope } from '@hellocoop/types'
  import { Button } from '../types'

  interface $$Props {
    label?: string
    style?: any
    color?: Button.Color
    theme?: Button.Theme
    hover?: Button.Hover
    scope?: Scope[]
    updateScope?: Button.UpdateScope
    targetURI?: string
    providerHint?: ProviderHint[],
    showLoader?: boolean,
    disabled?: boolean
  }

  // All prop exports must still be typed standalone and in the $$Props interface
  export let label: string = "ō&nbsp;&nbsp;&nbsp;Continue with Hellō";
  export let style: any = {} //TBD any
  export let color: Button.Color = "black"
  export let theme: Button.Theme = "ignore-light"
  export let hover: Button.Hover = "pop"
  export let scope: Scope[];
  export let updateScope: Button.UpdateScope;
  export let targetURI: string = ""
  export let providerHint: ProviderHint[];
  export let showLoader: boolean = false
  export let disabled: boolean = false

  let clicked: boolean = false
  const loginRoute = new URL(routeConfig.login, window.location.origin)
  if(scope)
    loginRoute.searchParams.set("scope", scope.join(" "))

  loginRoute.searchParams.set("target_uri", targetURI || window.location.pathname)
  
  if(updateScope)
      loginRoute.searchParams.set("scope", "profile_update " + updateScope)

  if(providerHint)
    loginRoute.searchParams.set("provider_hint", providerHint.join(" "))

  const onClickHandler = (): void => {
      clicked = true
      window.location.href = loginRoute.href
  }
</script>

<button
  on:click={onClickHandler}
  class="hello-btn {Button.CLASS_MAPPING[color]?.[theme]} {Button.HOVER_MAPPING[hover]}"
  class:hello-btn-loader={showLoader || clicked}
  disabled={disabled || clicked}
  {style}
>
  {@html label}
</button>