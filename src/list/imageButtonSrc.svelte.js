
import { onDestroy } from "svelte"
import { textImage } from "../common"

const cache = {}

const wrap = (id, text, width, height)=>{
  let src = $state(cache[id] || textImage(text, width, height).toDataURL("image/png"))
  let destory = false
  onDestroy(()=>destory = true)
  if (!cache[id]){
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = `${import.meta.env.VITE_CDN}${id}.png`
    img.onload = ()=>{
      if (destory){ return }
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0)
      cache[id] = canvas.toDataURL("image/png")
      src = cache[id]
    }
  }
  return { get src(){ return src } }
}

export default wrap
