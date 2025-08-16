<script>
  let {
    children,
  } = $props()
</script>

<p class="title">{@render children?.()}</p>

<style>
  .title{
    text-align: center;
    padding: 1em;
  }
</style>
