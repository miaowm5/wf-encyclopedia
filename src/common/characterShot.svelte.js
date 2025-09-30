import spriteSheet from './spriteSheet.svelte.js'

const wrap = (back, front, effect=[])=>{

  const emptyCanvas = ()=>{
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    return { get src(){ return canvas } }
  }

  const backCanvas = $derived.by(()=>{
    if (!back){ return emptyCanvas() }
    return spriteSheet('character/story', back)
  })
  const frontCanvas = $derived.by(()=>{
    if (!front){ return emptyCanvas() }
    return spriteSheet('character/story', front)
  })
  const effectCanvas = $derived.by(()=>{
    return effect.map((eff)=>{
      return spriteSheet('character/story', eff)
    })
  })

  const src = $derived.by(()=>{
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 570
    canvas.height = 690
    if (backCanvas.canvas && frontCanvas.canvas && effectCanvas.every(item => item.canvas !== null)){
      ctx.drawImage(backCanvas.canvas, 0, 0)
      ctx.drawImage(frontCanvas.canvas, 0, 0)
      effectCanvas.forEach((eff)=>{ ctx.drawImage(eff.canvas, 0, 0) })
    }
    return canvas.toDataURL("image/png")
  })

  return { get src(){ return src } }
}

export default wrap
