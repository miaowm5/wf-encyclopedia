<script>
  import LazyLoad from './lazyLoad.svelte'

  let { src, alt, children, lazyLoad = true } = $props()
  let loadOver = $state(false)
</script>

<LazyLoad lazy={lazyLoad}>
  {@render children?.()}
  {#snippet loadChildren()}
    {#if !loadOver}{@render children?.()}{/if}
    <img src={src} alt={alt ? alt : src} onload={()=>loadOver=true} class:loading={!loadOver}>
  {/snippet}
</LazyLoad>

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
  .loading{ display: none; }
</style>
