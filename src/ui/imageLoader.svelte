<script>
  let { src, alt, children } = $props()
  let realSrc = $state(null)
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
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0)
      realSrc = canvas.toDataURL("image/png")
    }
    return ()=>{ destory = true }
  }
  let clearFunc = null

  $effect(()=>{
    if (clearFunc){ clearFunc() }
    clearFunc = load(src)
  })
</script>

{#if realSrc}
  <img src={realSrc} alt={alt ? alt : src}>
{:else}
  {@render children?.()}
{/if}

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
