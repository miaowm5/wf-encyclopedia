import spriteSheet from './spriteSheet.svelte.js'

const wrap = (back, front)=>{

  const emptyCanvas = ()=>{
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    return { get src(){ return canvas } }
  }

  const backCanvas = $derived.by(()=>{
    if (!back){ return emptyCanvas() }
    return spriteSheet('character/story', back, 'canvas')
  })
  const frontCanvas = $derived.by(()=>{
    if (!front){ return emptyCanvas() }
    return spriteSheet('character/story', front, 'canvas')
  })

  const src = $derived.by(()=>{
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 570
    canvas.height = 690
    if (backCanvas.src && frontCanvas.src){
      ctx.drawImage(backCanvas.src, 0, 0)
      ctx.drawImage(frontCanvas.src, 0, 0)
    }
    return canvas.toDataURL("image/png")
  })

  return { get src(){ return src } }
}

export default wrap
