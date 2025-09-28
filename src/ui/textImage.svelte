<script>
  import { textImage } from "../common"
  let {
    text,
    width,
    height,
    style = {},
  } = $props()
  const src = $derived.by(()=>{
    return textImage(text, width, height, style).toDataURL("image/png")
  })
</script>

<img src={src} alt={text}>

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
