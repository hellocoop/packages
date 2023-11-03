<script setup lang="ts">
import { ref } from 'vue'
import { ContinueButton, useHelloProviderContext, UpdateEmailButton, LoggedIn } from '@hellocoop/vue'
const test = useHelloProviderContext()
console.log(test)
</script>

<template>
  <ContinueButton color="black" theme="aware-invert" hover="flare" :providerHint="['google', 'facebook--']" :scope="['openid', 'email']" />
  <UpdateEmailButton/>
  <LoggedIn>

  </LoggedIn>
</template>