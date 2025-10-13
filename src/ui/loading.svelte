<script>

  let {
    finish = false,
    error = [],
    children,
  } = $props()

</script>

{#if error.length > 0}
  <p>{error[0]}</p>
{:else if finish}
  {@render children?.()}
{:else}
  <p>Loading...</p>
{/if}
