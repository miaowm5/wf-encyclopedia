<script>
  import { spriteSheet } from '../common'
  import LazyLoad from './lazyLoad.svelte'
  import spritesheetCache from './spritesheetCache.js'

  let {
    spritesheet,
    file,
    alt,
    children,
    lazyLoad = true,
    cdn = 'cdn',
    cache = false,
  } = $props()

  let sprite = $state(null)
  const load = ()=>{
    sprite = spriteSheet(()=>spritesheet, ()=>file, ()=>cdn, cache ? spritesheetCache : null)
  }
</script>

{#if sprite && sprite.canvas}
  <img src={sprite.src} alt={alt ? alt : file}>
{:else}
  <LazyLoad lazy={lazyLoad} load={load}>
    {@render children?.()}
  </LazyLoad>
{/if}

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
