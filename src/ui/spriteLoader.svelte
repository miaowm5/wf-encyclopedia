<script>
  import { spriteSheet } from '../common'
  import lazyLoadWrap from './lazyLoad.svelte.js'

  let {
    spritesheet,
    file,
    alt,
    children,
    lazyLoad = true,
    cdn = 'cdn',
  } = $props()

  let node = $state(null)
  let lazyLoadStatus = lazyLoadWrap(()=>node, lazyLoad)

  const sprite = $derived.by(()=>{
    if (!lazyLoadStatus.load){ return null }
    return spriteSheet(spritesheet, file, 'canvas', cdn)
  })
</script>

{#if sprite && sprite.src}
  <img src={sprite.src.toDataURL("image/png")} alt={alt ? alt : file}>
{:else}
  {#if lazyLoad}<span bind:this={node}></span>{/if}
  {@render children?.()}
{/if}

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
