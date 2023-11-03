<script setup lang="ts">
  import { ref } from 'vue'
  import { routeConfig } from "../provider.js"
  import { Button, type ProviderHint, type Scope } from '../types'
  
  const clicked = ref(false)

  interface Props {
    label?: string
    style?: any
    color?: Button.Color
    theme?: Button.Theme
    hover?: Button.Hover
    scope?: Scope[]
    updateScope?: Button.UpdateScope
    targetURI?: string
    providerHint?: ProviderHint[]
    showLoader?: boolean
    disabled?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    label: "ō&nbsp;&nbsp;&nbsp;Continue with Hellō",
    color: "black",
    theme: "ignore-light",
    hover: "pop",
    showLoader: false,
    disabled: false
  })

  const loginRoute = new URL(routeConfig.login, window.location.origin)

  if(props.scope)
    loginRoute.searchParams.set("scope", props.scope.join(" "))

  loginRoute.searchParams.set("target_uri", props.targetURI || window.location.pathname)
  
  if(props.updateScope)
      loginRoute.searchParams.set("scope", "profile_update " + props.updateScope)

  if(props.providerHint)
    loginRoute.searchParams.set("provider_hint", props.providerHint.join(" "))
  
  const onClickHandler = (): void => {
    clicked.value = true
    window.location.href = loginRoute.href
  }
</script>

<template>
  <button
    @click="onClickHandler"
    :class="['hello-btn', Button.CLASS_MAPPING[props.color]?.[props.theme], Button.HOVER_MAPPING[hover], (showLoader || clicked) && 'hello-btn-loader']"
    :disabled="props.disabled || clicked"
    :style="style"
  >
    <span v-html="label"></span>
  </button>
</template>