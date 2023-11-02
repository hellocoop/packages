<script>
    import { LoginButton, getHelloProviderContext } from "@hellocoop/svelte";
    const test = getHelloProviderContext()
</script>

<LoginButton/>

{JSON.stringify(test)}