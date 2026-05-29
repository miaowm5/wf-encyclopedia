import { wrap as spriteSheet, wrapAsync as spriteSheetAsync } from './spriteSheet.svelte.js'

const emptyCanvas = (width = 1, height = 1)=>{
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return { get canvas(){ return canvas } }
}
const empty = emptyCanvas(1, 1)
const basic = emptyCanvas(570, 690)

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

  const backSprite = spriteSheet('character/story', ()=>back, 'cdn', cache)
  const frontSprite = spriteSheet('character/story', ()=>front, 'cdn', cache)
  const backCanvas = $derived(Boolean(back) ? backSprite : empty)
  const frontCanvas = $derived(Boolean(front) ? frontSprite : empty)
  let effectCanvas = $state([])
  $effect(()=>{
    const list = effect.map((eff)=>spriteSheetAsync('character/story', eff, 'cdn', cache))
    effectCanvas = list
    return ()=>{ list.forEach((sprite)=>sprite.destroy()) }
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
    return basic.canvas
  })
  const src = $derived(canvas.toDataURL("image/png"))

  return { get src(){ return src } }
}

export default wrap
