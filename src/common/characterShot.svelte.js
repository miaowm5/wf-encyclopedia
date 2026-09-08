import spriteSheet from './spriteSheet.svelte.js'

const emptyCanvas = (width = 1, height = 1)=>{
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return { get canvas(){ return canvas } }
}
const empty = emptyCanvas(1, 1)
let srcCache = null

const wrap = (backParam, frontParam, effectParam=[], cache, loadedParam = true)=>{
  const loaded = $derived.by(()=>typeof loadedParam === 'function' ? loadedParam() : loadedParam)
  const getValue = (param, defaultV = null)=>{
    return ()=>{
      if (!loaded){ return defaultV }
      if (typeof param === 'function'){ return param() }
      return param
    }
  }
  const back = $derived.by(getValue(backParam, null))
  const front = $derived.by(getValue(frontParam, null))
  const effect = $derived.by(getValue(effectParam, []))

  const backCanvas = $derived.by(()=>{
    if (!back){ return empty }
    return spriteSheet('character/story', back, 'cdn', cache)
  })
  const frontCanvas = $derived.by(()=>{
    if (!front){ return empty }
    return spriteSheet('character/story', front, 'cdn', cache)
  })
  const effectCanvas = $derived.by(()=>{
    return effect.map((eff)=>{
      return spriteSheet('character/story', eff, 'cdn', cache)
    })
  })

  const canvas = $derived.by(()=>{
    if (loaded && backCanvas.canvas && frontCanvas.canvas && effectCanvas.every(item => item.canvas !== null)){
      const canvas = emptyCanvas(570, 690).canvas
      const ctx = canvas.getContext("2d")
      ctx.drawImage(backCanvas.canvas, 0, 0)
      ctx.drawImage(frontCanvas.canvas, 0, 0)
      effectCanvas.forEach((eff)=>{ ctx.drawImage(eff.canvas, 0, 0) })
      return canvas
    }
    return null
  })
  const src = $derived.by(()=>{
    if (canvas){ return canvas.toDataURL("image/png") }
    if (!srcCache){ srcCache = emptyCanvas(570, 690).canvas.toDataURL("image/png") }
    return srcCache
  })

  return { get src(){ return src } }
}

export default wrap
