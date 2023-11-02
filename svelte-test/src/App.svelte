<script lang="ts">
  import { HelloProvider } from '@hellocoop/svelte'
  import Counter from './lib/Counter.svelte';
</script>


<HelloProvider config={{login: "/api/hello-world"}}>
  <Counter/>
</HelloProvider>