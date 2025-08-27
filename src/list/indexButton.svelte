<script>
  import { onDestroy } from "svelte"
  import { textImage } from "../common"

  const {id, onclick} = $props()

  let destory = false
  let src = $state(null)

  $effect(()=>{
    src = textImage(id, 992, 352).toDataURL("image/png")
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = `${import.meta.env.VITE_CDN}ui/${id}_btn.png`
    img.onload = ()=>{
      if (destory){ return }
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = 992
      canvas.height = 352
      ctx.drawImage(img, 0, 0)
      src = canvas.toDataURL("image/png")
    }
  })
  onDestroy(()=>destory = true)
</script>

<button
  onclick={onclick}
  aria-label={id}
></button>
