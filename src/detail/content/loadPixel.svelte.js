
import { onDestroy } from 'svelte'
import { api, spriteSheet } from '../../common'

let configCache = null
const promiseCache = {}

const loadConfig = async ()=>{
  if (configCache){ return configCache }
  const url = `${import.meta.env.VITE_CDN2}pixelFrame.json`
  let promise = promiseCache[url]
  if (!promise){
    promise = new Promise((resolve)=>{
      api(url, {
        success: (data)=>{ resolve(data) },
        fail: (err)=>{ console.error(err), resolve(null) },
        after: ()=>{ promiseCache[url] = undefined },
        cors: true,
      })
    })
    promiseCache[url] = promise
  }
  const result = await promise
  if (result){ configCache = result }
  return configCache
}

const main = (character)=>{
  let cancelFunc = false
  let pixelData = $state(null)
  let src = $state(null)

  let image = $derived.by(()=>{
    return spriteSheet('pixel', character, 'cdn2')
  })

  const load = async ()=>{
    if (!character){ return }
    const config = await loadConfig()
    if (cancelFunc){ return }
    if (!config){ return }
    pixelData = config
  }
  load()

  let config = $derived.by(()=>{
    if (!character || !pixelData || !pixelData[character]){ return null }
    if (!image.canvas){ return null }
    let frames = pixelData[character]
    let result = {}
    let timeline = []
    let imageList = []
    let size = [256,256,0,0]
    frames.forEach((frame)=>{
      let canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = frame.w
      canvas.height = frame.h
      ctx.drawImage(image.canvas,
        frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h,
      )
      if (frame.r){
        const dstCanvas = document.createElement('canvas')
        const dstCtx = dstCanvas.getContext('2d')
        dstCanvas.width = frame.h
        dstCanvas.height = frame.w
        dstCtx.imageSmoothingEnabled = false
        dstCtx.save()
        dstCtx.translate(0, dstCanvas.height)
        dstCtx.rotate(-Math.PI / 2)
        dstCtx.drawImage(canvas, 0, 0)
        dstCtx.restore()
        canvas = dstCanvas
      }
      let name = frame.n.slice(frame.n.length - 4, frame.n.length) - 0
      while (timeline.length < name){ timeline.push(name) }
      if (-frame.fx < size[0]){ size[0] = -frame.fx }
      if (-frame.fy < size[1]){ size[1] = -frame.fy }
      let width = frame.r ? frame.h : frame.w
      let height = frame.r ? frame.w : frame.h
      if (-frame.fx + width > size[2]){ size[2] = -frame.fx + width }
      if (-frame.fy + height > size[3]){ size[3] = -frame.fy + height }
      imageList.push([name, canvas, -frame.fx, -frame.fy])
    })
    size[2] = size[2] - size[0]
    size[3] = size[3] - size[1]
    imageList.forEach(([name, canvas, x, y])=>{
      const finalCanvas = document.createElement("canvas")
      const finalCtx = finalCanvas.getContext("2d")
      finalCanvas.width = size[2]
      finalCanvas.height = size[3]
      finalCtx.imageSmoothingEnabled = false
      finalCtx.drawImage(canvas, x - size[0], y - size[1])
      result[name] = finalCanvas
    })
    return {
      timeline,
      frame: timeline.length,
      width: size[2],
      height: size[3],
      image: result,
    }
  })

  let play = $state(true)
  let scale = $state(2)
  let speed = $state(20)

  let imageCache = {}
  const getImage = (id)=>{
    if (!imageCache[id]){
      let origin = config.image[id]
      const finalCanvas = document.createElement("canvas")
      const finalCtx = finalCanvas.getContext("2d")
      const dw = config.width * scale
      const dh = config.height * scale
      finalCanvas.width = dw
      finalCanvas.height = dh
      finalCtx.imageSmoothingEnabled = false
      finalCtx.drawImage(origin,
        0, 0, config.width, config.height,
        0, 0, dw, dh
      )
      imageCache[id] = finalCanvas.toDataURL("image/png")
    }
    return imageCache[id]
  }
  let currentFrame = 0
  let timer = null
  const updateFrame = ()=>{
    timer = setTimeout(()=>{
      if (config && play){
        currentFrame += 1
        if (currentFrame >= config.frame){ currentFrame = 0 }
        let id = config.timeline[currentFrame]
        src = getImage(id)
      }
      updateFrame()
    }, speed)
  }
  updateFrame()

  onDestroy(()=>{
    cancelFunc = true
    clearTimeout(timer)
  })

  return {
    get src(){ return src },
    get config(){ return config },
    get playing(){ return play },
    get scaleRate(){ return scale },
    get speedRate(){ return speed },
    play(){ play = true },
    pause(){ play = false },
    scale(rate){
      scale = rate
      imageCache = {}
      if (!play){ src = getImage(config.timeline[currentFrame]) }
    },
    speed(rate){
      play = true
      speed = rate
    },
    changeFrame(offset){
      play = false
      let currentID = config.timeline[currentFrame]
      let nextID = currentID
      while (nextID === currentID){
        currentFrame += offset
        if (currentFrame >= config.frame){ currentFrame = 0 }
        if (currentFrame < 0){ currentFrame = config.frame - 1 }
        nextID = config.timeline[currentFrame]
      }
      src = getImage(config.timeline[currentFrame])
    },
  }
}

export default main
