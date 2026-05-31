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

  let lazyLoadStatus = $state((()=>!lazyLoad)())

  const sprite = $derived.by(()=>{
    if (!lazyLoadStatus){ return null }
    return spriteSheet(spritesheet, file, cdn, cache ? spritesheetCache : null)
  })
  const draw = (canvas)=>{
    const ctx = canvas.getContext('2d')
    canvas.width = sprite.canvas.width
    canvas.height = sprite.canvas.height
    ctx.drawImage(sprite.canvas, 0, 0)
  }
</script>

{#if sprite && sprite.canvas}
  <canvas {@attach draw} aria-label={alt ? alt : file}></canvas>
{:else}
  <LazyLoad lazy={lazyLoad} load={()=>{ lazyLoadStatus = true }}>
    {@render children?.()}
  </LazyLoad>
{/if}

<style>
  canvas{
    max-width: 100%;
    max-height: 100%;
  }
</style>
