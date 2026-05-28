<script>
  import LazyLoad from './lazyLoad.svelte'

  let { src, alt, children, lazyLoad = true } = $props()
  let loadOver = $state(false)
  let loadStart = $state(false)
</script>

<LazyLoad lazy={lazyLoad} load={()=>loadStart = true}>
  {#if !loadOver}{@render children?.()}{/if}
  {#if loadStart}
    <img src={src} alt={alt ? alt : src} onload={()=>loadOver=true} class:loading={!loadOver}>
  {/if}
</LazyLoad>

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
  .loading{ display: none; }
</style>
