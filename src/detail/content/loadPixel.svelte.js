
import { onDestroy } from 'svelte'
import { api, spriteSheet } from '../../common'

let configCache = null
const promiseCache = {}

const loadConfig = async ()=>{
  if (configCache){ return configCache }
  const url = `${import.meta.env.VITE_CDN}character/pixel.json`
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

const createFrame = (frames, image, offset = 0)=>{
  let imageList = []
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
    let name = frame.n + offset
    let width = frame.r ? frame.h : frame.w
    let height = frame.r ? frame.w : frame.h
    imageList.push([name, canvas, -frame.fx, -frame.fy, width, height])
  })
  return imageList
}
const createTimeline = (config, imageList)=>{
  let [begin, end] = [config.begin, config.end]
  let list = imageList.filter((item)=>item[0] >= begin && item[0] <= end)
  let size = [256,256,0,0]
  let timeline = []
  list.forEach((frame)=>{
    let name = frame[0]
    while (timeline.length <= name - begin){ timeline.push(name) }
    let [x, y, width, height] = [frame[2], frame[3], frame[4], frame[5]]
    if (width !== 1 && height !== 1){
      if (x < size[0]){ size[0] = x }
      if (y < size[1]){ size[1] = y }
      if (x + width > size[2]){ size[2] = x + width }
      if (y + height > size[3]){ size[3] = y + height }
    }else{ console.log('need check pixel size') }
  })
  size[2] = size[2] - size[0]
  size[3] = size[3] - size[1]
  let result = {}
  list.forEach(([name, canvas, x, y])=>{
    const finalCanvas = document.createElement("canvas")
    const finalCtx = finalCanvas.getContext("2d")
    finalCanvas.width = size[2]
    finalCanvas.height = size[3]
    finalCtx.imageSmoothingEnabled = false
    finalCtx.drawImage(canvas, x - size[0], y - size[1])
    result[name] = finalCanvas
  })
  return {
    movie: {
      name: config.name, timeline, frame: timeline.length,
      width: size[2], height: size[3],
    },
    frame: result
  }
}

const main = (character, hasSpecial = true)=>{
  let cancelFunc = false
  let pixelData = $state(null)

  let image = $derived.by(()=>{
    if (!hasSpecial){ return null }
    return spriteSheet('character/pixel_special', character)
  })
  let image2 = $derived.by(()=>{ return spriteSheet('character/pixel_normal', character) })
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
    if (hasSpecial && !image.canvas){ return null }
    if (!image2.canvas){ return null }
    let config = pixelData[character]
    if (!config){ return null }

    let timeline = [...config.timeline]

    let imageList = []
    imageList = imageList.concat(createFrame(config.normal, image2, 0))
    if (hasSpecial){
      let specialList = createFrame(config.special, image, 10000)
      timeline.push({
        name: "special",
        begin: 10000,
        end: specialList[specialList.length - 1][0]
      })
      imageList = imageList.concat(specialList)
    }
    const movie = {}
    let frame = {}
    timeline.forEach((config)=>{
      const result = createTimeline(config, imageList)
      movie[config.name] = result.movie
      frame = { ...frame, ...result.frame }
    })
    return { movie, frame, list: Object.keys(movie) }
  })

  let src = $state(null)
  let play = $state(true)
  let action = $state(hasSpecial ? 'special' : 'skill_ready')
  let scale = $state(2)
  let speed = $state(20)
  let currentFrame = 0

  let imageCache = {}
  const refreshImage = ()=>{
    const movie = config.movie[action]
    const id = movie.timeline[currentFrame]
    if (!imageCache[id]){
      let origin = config.frame[id]
      if (!origin){
        console.log(config)
        return
      }
      const finalCanvas = document.createElement("canvas")
      const finalCtx = finalCanvas.getContext("2d")
      const dw = movie.width * scale
      const dh = movie.height * scale
      finalCanvas.width = dw
      finalCanvas.height = dh
      finalCtx.imageSmoothingEnabled = false
      finalCtx.drawImage(origin,
        0, 0, movie.width, movie.height,
        0, 0, dw, dh
      )
      imageCache[id] = finalCanvas.toDataURL("image/png")
    }
    src = imageCache[id]
  }

  let timer = null
  const updateFrame = ()=>{
    timer = setTimeout(()=>{
      if (config && play){
        currentFrame += 1
        if (currentFrame >= config.movie[action].frame){ currentFrame = 0 }
        refreshImage()
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
    get src(){
      if (!config){ return null }
      return src
    },
    get list(){
      if (!config){ return null }
      return config.list
    },
    get config(){
      if (!config){ return {} }
      return config.movie[action]
    },
    get playing(){ return play },
    get scaleRate(){ return scale },
    get speedRate(){ return speed },
    play(){ play = true },
    pause(){ play = false },
    action(name){
      action = name
      play = true
      currentFrame = 0
    },
    scale(rate){
      scale = rate
      imageCache = {}
      if (!play){ refreshImage() }
    },
    speed(rate){
      play = true
      speed = rate
    },
    changeFrame(offset){
      play = false
      let findBreak = false
      let movie = config.movie[action]
      let currentID = movie.timeline[currentFrame]
      let nextID = currentID
      while (nextID === currentID){
        currentFrame += offset
        if (currentFrame >= movie.frame){
          if (findBreak){ break }
          currentFrame = 0
          findBreak = true
        }
        if (currentFrame < 0){
          if (findBreak){ break }
          currentFrame = movie.frame - 1
          findBreak = true
        }
        nextID = movie.timeline[currentFrame]
      }
      refreshImage()
    },
  }
}

export default main
