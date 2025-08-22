<script>
import spriteSheet from './spriteSheet.svelte.js'

  const { file = null, name = '' } = $props()

  const drawName = (name)=>{
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 212
    canvas.height = 50
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = "36px sans-serif"
    ctx.fillStyle = "white"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2, 212)
    return canvas
  }

  const icon = $derived.by(()=>{
    return spriteSheet('character/head2', file ? file : null, 'canvas')
  })
  const src = $derived.by(()=>{
    if (icon.src){
      return icon.src.toDataURL("image/png")
    }else{
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = 212
      canvas.height = 212
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const nameCanvas = drawName(name)
      ctx.drawImage(nameCanvas, 0, (canvas.height - nameCanvas.height) / 2)
      return canvas.toDataURL("image/png")
    }
  })

</script>

<img src={src} alt={name} />

<style>
  img{ width: 100% }
</style>
