import { api } from './m5api'
import cdnUrl from './cdn'

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
        success: (data)=>{
          const pure = {}
          Object.keys(data).forEach((key)=>{
            pure[key.toLowerCase()] = data[key]
          })
          resolve(pure)
        },
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
  const url = `${cdn}${spritesheet}/${file}`
  if (cacheImage[url]){ return cacheImage[url] }

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
  if (image){ cacheImage[url] = image }
  return image
}

let canvasQueueStatus = 'idle'
let canvasQueue = []
const createImageQueue = ()=>{
  if (canvasQueue.length === 0){
    canvasQueueStatus = 'idle'
    return
  }
  const task = canvasQueue.splice(0, 20)
  task.forEach(([image, spriteConfig, key, callback, cache])=>{
    if (cache && cache.get(key)){ callback(cache.get(key)); return }
    let srcCanvas = document.createElement("canvas")
    let ctx = srcCanvas.getContext("2d")
    srcCanvas.width = spriteConfig.frame.w
    srcCanvas.height = spriteConfig.frame.h
    ctx.drawImage(image,
      spriteConfig.frame.x, spriteConfig.frame.y,
      spriteConfig.frame.w, spriteConfig.frame.h,
      0, 0,
      spriteConfig.frame.w, spriteConfig.frame.h,
    )
    if (spriteConfig.rotated){
      const dstCanvas = document.createElement('canvas')
      const dstCtx = dstCanvas.getContext('2d')
      dstCanvas.width = spriteConfig.frame.h
      dstCanvas.height = spriteConfig.frame.w
      dstCtx.imageSmoothingEnabled = false
      dstCtx.save()
      dstCtx.translate(0, dstCanvas.height)
      dstCtx.rotate(-Math.PI / 2)
      dstCtx.drawImage(srcCanvas, 0, 0)
      dstCtx.restore()
      srcCanvas = dstCanvas
    }
    let dstCanvas = document.createElement("canvas")
    let dstCtx = dstCanvas.getContext("2d")
    dstCanvas.width = spriteConfig.sourceSize.w
    dstCanvas.height = spriteConfig.sourceSize.h
    dstCtx.drawImage(srcCanvas, spriteConfig.spriteSourceSize.x, spriteConfig.spriteSourceSize.y)
    if (cache){ cache.set(key, dstCanvas) }
    callback(dstCanvas)
  })
  requestAnimationFrame(createImageQueue)
}
const createCanvas = async (image, spriteConfig, key, cache)=>{
  if (cache && cache.get(key)){ return cache.get(key) }
  const canvas = await new Promise((resolve)=>{
    const callback = (canvas)=>{ resolve(canvas) }
    canvasQueue.push([image, spriteConfig, key, callback, cache])
    if (canvasQueueStatus === 'idle'){
      canvasQueueStatus = 'pending'
      requestAnimationFrame(createImageQueue)
    }
  })
  return canvas
}

const wrap = (spritesheetParam, fileParam = null, cdnTypeParam='cdn', cache=null)=>{
  const spritesheet = $derived.by(()=>typeof spritesheetParam === 'function' ? spritesheetParam() : spritesheetParam)
  const file = $derived.by(()=>typeof fileParam === 'function' ? fileParam() : fileParam)
  const cdnType = $derived.by(()=>typeof cdnTypeParam === 'function' ? cdnTypeParam() : cdnTypeParam)
  const key = $derived(file ? `${cdnType}${spritesheet}/${file}` : null)

  let canvas = $state(null)
  const src = $derived.by(()=>{
    if (!key){ return empty }
    const srcKey = `src.${key}`
    if (cache && cache.get(srcKey)){ return cache.get(srcKey) }
    if (!canvas){ return empty }
    let src = canvas.toDataURL("image/png")
    if (cache){ cache.set(srcKey, src) }
    return src
  })

  const load = async (spritesheet, file, cdn, cache, key, isCancel)=>{
    if (!key){ return }
    const sheetConfig = await loadConfig(spritesheet, cdn)
    if (isCancel()){ return }
    const spriteConfig = sheetConfig[file.toLowerCase()]
    if (!spriteConfig){ return }
    const image = await loadImage(spritesheet, `${spriteConfig.image}?${sheetConfig.timestamp || ''}`, cdn)
    if (!image){ return }
    if (isCancel()){ return }
    const finalCanvas = await createCanvas(image, spriteConfig, key, cache)
    if (isCancel()){ return }
    canvas = finalCanvas
  }
  $effect(()=>{
    if (cache && cache.get(key)){ canvas = cache.get(key); return }
    let cancelFunc = false
    const isCancel = ()=>cancelFunc
    canvas = null
    load(spritesheet, file, cdnUrl(cdnType), cache, key, isCancel)
    return ()=>{ cancelFunc = true }
  })

  return {
    get src(){ return src },
    get canvas(){ return canvas }
  }
}

export default wrap
