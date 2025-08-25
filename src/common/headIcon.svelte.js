import spriteSheet from './spriteSheet.svelte.js'
import textImage from './textImage.svelte.js'

const wrap = (file, name)=>{

  const icon = $derived.by(()=>{
    return spriteSheet('character/head2', file ? file : null)
  })
  const src = $derived.by(()=>{
    if (icon.src){ return icon.src }
    const canvas = textImage(name, 212, 212, { color: 'white', background: '#000000', size: '36px' })
    return canvas.toDataURL("image/png")
  })

  return { get src(){ return src } }
}

export default wrap
