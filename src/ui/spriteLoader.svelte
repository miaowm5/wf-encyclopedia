<script>
  import { spriteSheet } from '../common'
  import LazyLoad from './lazyLoad.svelte'

  let {
    spritesheet,
    file,
    alt,
    children,
    lazyLoad = true,
    cdn = 'cdn',
  } = $props()

  let lazyLoadStatus = $state(false)

  const sprite = $derived.by(()=>{
    if (!lazyLoadStatus){ return null }
    return spriteSheet(spritesheet, file, cdn)
  })
</script>

{#if sprite && sprite.canvas}
  <img src={sprite.src} alt={alt ? alt : file}>
{:else}
  <LazyLoad lazy={lazyLoad} load={()=>{ lazyLoadStatus = true }} />
  {@render children?.()}
{/if}

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
