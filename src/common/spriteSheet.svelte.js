import { onDestroy, onMount } from "svelte"
import { api } from './m5api'

const cache = {}
const cacheImage = {}
const empty = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`

const loadConfig = async (spritesheet)=>{
  if (cache[spritesheet]){ return cache[spritesheet] }
  const url = `${import.meta.env.VITE_CDN}${spritesheet}.json`
  const result = await new Promise((resolve)=>{
    api(url, { success: (data)=>{ resolve(data) } })
  })
  if (result){ cache[spritesheet] = result }
  return result
}
const loadImage = async (spritesheet, file)=>{
  const key = `${spritesheet}/${file}`
  if (cacheImage[key]){ return cacheImage[key] }
  const image = await new Promise((resolve)=>{
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = `${import.meta.env.VITE_CDN}${key}`
    img.onload = ()=>{ resolve(img) }
    img.onerror = ()=>{ resolve(null) }
  })
  if (image){ cacheImage[key] = image }
  return image
}

const wrap = (spritesheet, file = null)=>{
  let cancelFunc = false
  onDestroy(()=>{ cancelFunc = true })
  let src = $state(empty)
  const load = async ()=>{
    const sheetConfig = await loadConfig(spritesheet)
    if (cancelFunc){ return }
    const spriteConfig = sheetConfig[file + '.png']
    if (!spriteConfig){ return }
    const image = await loadImage(spritesheet, spriteConfig.image)
    if (!image){ return }
    if (cancelFunc){ return }
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = spriteConfig.sourceSize.w
    canvas.height = spriteConfig.sourceSize.h
    ctx.drawImage(image,
      spriteConfig.frame.x, spriteConfig.frame.y,
      spriteConfig.frame.w, spriteConfig.frame.h,
      spriteConfig.spriteSourceSize.x, spriteConfig.spriteSourceSize.y,
      spriteConfig.frame.w, spriteConfig.frame.h,
    )
    src = canvas.toDataURL("image/png")
  }
  onMount(()=>{
    if (!file){ return }
    load()
  })
  return { get src(){ return src } }
}

export default wrap
