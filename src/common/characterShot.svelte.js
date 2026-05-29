import spriteSheet from './spriteSheet.svelte.js'

const emptyCanvas = (width = 1, height = 1)=>{
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return { get canvas(){ return canvas } }
}
const empty = emptyCanvas(1, 1)
let srcCache = null

const wrap = (back, front, effect=[], cache)=>{

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
    if (backCanvas.canvas && frontCanvas.canvas && effectCanvas.every(item => item.canvas !== null)){
      const canvas = emptyCanvas(570, 690).canvas
      const ctx = canvas.getContext("2d")
      ctx.drawImage(backCanvas.canvas, 0, 0)
      ctx.drawImage(frontCanvas.canvas, 0, 0)
      effectCanvas.forEach((eff)=>{ ctx.drawImage(eff.canvas, 0, 0) })
      return canvas
    }
    if (!srcCache){ srcCache = emptyCanvas(570, 690).canvas.toDataURL("image/png") }
    return null

  })
  const src = $derived(canvas ? canvas.toDataURL("image/png") : srcCache)

  return { get src(){ return src } }
}

export default wrap
