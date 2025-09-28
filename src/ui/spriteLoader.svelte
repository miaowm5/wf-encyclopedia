<script>
  import { spriteSheet } from '../common'
  let {
    spritesheet,
    file,
    alt,
    children,
    cdn = 'cdn',
  } = $props()

  const sprite = $derived.by(()=>{
    return spriteSheet(spritesheet, file, 'canvas', cdn)
  })
</script>

{#if sprite.src}
  <img src={sprite.src.toDataURL("image/png")} alt={alt ? alt : file}>
{:else}
  {@render children?.()}
{/if}

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
