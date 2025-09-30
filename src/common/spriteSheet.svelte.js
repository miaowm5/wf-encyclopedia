import { onDestroy } from "svelte"
import { api } from './m5api'

const cache = {}
const cacheImage = {}
const empty = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`
const promiseCache = {}

const loadConfig = async (spritesheet, cdn)=>{
  if (cache[spritesheet]){ return cache[spritesheet] }
  const url = `${cdn}${spritesheet}.json`
  let promise = promiseCache[url]
  if (!promise){
    promise = new Promise((resolve)=>{
      api(url, {
        success: (data)=>{ resolve(data) },
        fail: (err)=>{ console.error(err), resolve(null) },
        after: ()=>{ promiseCache[url] = undefined },
        cors: true
      })
    })
    promiseCache[url] = promise
  }
  const result = await promise
  if (result){ cache[spritesheet] = result }
  return result
}
const loadImage = async (spritesheet, file, cdn)=>{
  const key = `${spritesheet}/${file}`
  if (cacheImage[key]){ return cacheImage[key] }
  const url = `${cdn}${key}`

  let promise = promiseCache[url]
  if (!promise){
    promise = new Promise((resolve)=>{
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = url
      img.onload = ()=>{ resolve(img); promiseCache[url] = undefined }
      img.onerror = ()=>{ resolve(null); promiseCache[url] = undefined }
    })
    promiseCache[url] = promise
  }
  const image = await promise
  if (image){ cacheImage[key] = image }
  return image
}

let canvasQueueStatus = 'idle'
let canvasQueue = []
const createImageQueue = ()=>{
  if (canvasQueue.length === 0){
    canvasQueueStatus = 'idle'
    return
  }
  const [image, spriteConfig, callback] = canvasQueue.shift()
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
  callback(canvas)
  requestAnimationFrame(createImageQueue)
}
const createCanvas = async (image, spriteConfig)=>{
  const canvas = await new Promise((resolve)=>{
    const callback = (canvas)=>{ resolve(canvas) }
    canvasQueue.push([image, spriteConfig, callback])
    if (canvasQueueStatus === 'idle'){
      canvasQueueStatus = 'pending'
      requestAnimationFrame(createImageQueue)
    }
  })
  return canvas
}

const wrap = (spritesheet, file = null, cdnType='cdn')=>{
  const cdn = {
    "cdn": import.meta.env.VITE_CDN,
    "cdn2": import.meta.env.VITE_CDN2,
    "cdn3": import.meta.env.VITE_CDN3,
  }[cdnType] || import.meta.env.VITE_CDN
  let cancelFunc = false
  onDestroy(()=>{ cancelFunc = true })

  let src = $state(empty)
  let canvas = $state(null)

  const load = async ()=>{
    if (!file){ return }
    const sheetConfig = await loadConfig(spritesheet, cdn)
    if (cancelFunc){ return }
    const spriteConfig = sheetConfig[file]
    if (!spriteConfig){ return }
    const image = await loadImage(spritesheet, `${spriteConfig.image}?${sheetConfig.timestamp || ''}`, cdn)
    if (!image){ return }
    if (cancelFunc){ return }
    const finalCanvas = await createCanvas(image, spriteConfig)
    if (cancelFunc){ return }
    canvas = finalCanvas
    src = finalCanvas.toDataURL("image/png")
  }
  load()
  return {
    get src(){ return src },
    get canvas(){ return canvas }
  }
}

export default wrap
