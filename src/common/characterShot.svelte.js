import spriteSheet from './spriteSheet.svelte.js'

const emptyCanvas = (width = 1, height = 1)=>{
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return { get canvas(){ return canvas } }
}
const empty = emptyCanvas(1, 1)
const basic = emptyCanvas(570, 690)

const wrap = (backParam, frontParam, effectParam=[], cache)=>{
  const back = $derived.by(()=>typeof backParam === 'function' ? backParam() : backParam)
  const front = $derived.by(()=>typeof frontParam === 'function' ? frontParam() : frontParam)
  const effect = $derived.by(()=>typeof effectParam === 'function' ? effectParam() : effectParam)

  const backExist = $derived(Boolean(back))
  const frontExist = $derived(Boolean(front))
  const backCanvas = $derived(backExist ? spriteSheet('character/story', ()=>back, 'cdn', cache) : empty)
  const frontCanvas = $derived(frontExist ? spriteSheet('character/story', ()=>front, 'cdn', cache) : empty)
  const effectCanvas = $derived.by(()=>{
    return effect.map((eff)=>{
      return spriteSheet('character/story', eff, 'cdn', cache)
    })
  })
  const canvas = $derived.by(()=>{
    if (backCanvas.canvas && frontCanvas.canvas && effectCanvas.every(item => item.canvas !== null)){
      const canvas = emptyCanvas(570, 690)
      const ctx = canvas.getContext("2d")
      ctx.drawImage(backCanvas.canvas, 0, 0)
      ctx.drawImage(frontCanvas.canvas, 0, 0)
      effectCanvas.forEach((eff)=>{ ctx.drawImage(eff.canvas, 0, 0) })
      return canvas
    }
    return basic
  })
  const src = $derived(canvas.toDataURL("image/png"))

  return { get src(){ return src } }
}

export default wrap
