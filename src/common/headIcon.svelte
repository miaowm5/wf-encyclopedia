<script>
  import spriteSheet from './spriteSheet.svelte.js'
  import textImage from './textImage.svelte.js'

  const { file = null, name = '' } = $props()

  const icon = $derived.by(()=>{
    return spriteSheet('character/head2', file ? file : null, 'canvas')
  })
  const src = $derived.by(()=>{
    if (icon.src){
      return icon.src.toDataURL("image/png")
    }else{
      const canvas = textImage(name, 212, 212, { color: 'white', background: '#000000', size: '36px' })
      return canvas.toDataURL("image/png")
    }
  })

</script>

<img src={src} alt={name} />

<style>
  img{ width: 100% }
</style>
