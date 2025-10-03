<script>
  import { textImage } from "../common"
  import LazyLoad from './lazyLoad.svelte'

  let {
    text,
    width,
    height,
    lazyLoad = true,
    style = {},
  } = $props()

  let lazyLoadStatus = $state(false)
  const src = $derived.by(()=>{
    if (!lazyLoadStatus){
      return `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`
    }
    return textImage(text, width, height, style).toDataURL("image/png")
  })
</script>

<LazyLoad lazy={lazyLoad} load={()=>{ lazyLoadStatus = true }}>
  <img src={src} alt={text} style:width={width} style:aspect-ratio={`${width}/${height}`} />
</LazyLoad>

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
