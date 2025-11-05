<script>

  let {
    finish = false,
    error = [],
    children,
  } = $props()

</script>

{#if error.length > 0}
  {#each error as e}<p>{e}</p>{/each}
{:else if finish}
  {@render children?.()}
{:else}
  <div class="container">
    <img class="loading" src={`${import.meta.env.VITE_CDN2}loading.gif`} width="30" height="32" alt="loading">
    <p>Loading...</p>
  </div>
{/if}

<style>
  .container{
    width: 100%;
    text-align: center;
    padding-top: 2em;
  }
  .loading{
    display:inline-block;
  }
</style>
