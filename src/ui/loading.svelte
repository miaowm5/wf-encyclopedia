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
  <p>Loading...</p>
{/if}
