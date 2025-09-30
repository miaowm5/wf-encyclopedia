<script>
  import lazyLoadWrap from './lazyLoad.svelte.js'

  let { src, alt, children, lazyLoad = true } = $props()

  let realSrc = $state(null)
  let node = $state(null)
  let lazyLoadStatus = lazyLoadWrap(()=>node, lazyLoad)

  const load = (src)=>{
    if (!src){ return }
    let destory = false
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src
    img.onload = ()=>{
      if (destory){ return }
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
      realSrc = canvas.toDataURL("image/png")
    }
    return ()=>{ destory = true }
  }
  let clearFunc = null

  $effect(()=>{
    if (clearFunc){ clearFunc() }
    if (!lazyLoadStatus.load){ return }
    clearFunc = load(src)
  })
</script>

{#if realSrc}
  <img src={realSrc} alt={alt ? alt : src}>
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
