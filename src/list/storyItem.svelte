<script>
  import { onDestroy } from "svelte"
  import { textImage } from "../common"
  const { data, active } = $props()

  let destory = false
  let src = $state(null)

  $effect(()=>{
    src = textImage(data.name[0], 1000, 184).toDataURL("image/png")
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = `${import.meta.env.VITE_CDN}banner/${data.item[1]}.png`
    img.onload = ()=>{
      if (destory){ return }
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = 1000
      canvas.height = 184
      ctx.drawImage(img, 0, 0)
      src = canvas.toDataURL("image/png")
    }
  })
  onDestroy(()=>destory = true)
</script>

{#if src}
  <div class={`item ${active ? 'active' : ''}`}><img src={src} alt={data.name[0]}></div>
{/if}

<style>
  .item{
    width: 100%;
    position: relative;
  }
  .item>img{
    width: 100%;
  }
</style>
