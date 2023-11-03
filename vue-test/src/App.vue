<script setup lang="ts">
import { HelloProvider } from '@hellocoop/vue';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <HelloProvider :auth="{foo: 'bar'}">
    <HelloWorld/>
  </HelloProvider>
</template>