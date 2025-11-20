<script>
  import { textImage } from "../common"
  import LazyLoad from './lazyLoad.svelte'
  import canvasBlob from './canvasBlob.svelte.js'

  let {
    text,
    width,
    height,
    lazyLoad = true,
    style = {},
  } = $props()

  let lazyLoadStatus = $state(false)
  const canvas = $derived.by(()=>{
    if (!lazyLoadStatus){ return null }
    return textImage(text, width, height, style)
  })
  const empty = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`
  const src = $derived(canvasBlob(canvas, empty))
</script>

<LazyLoad lazy={lazyLoad} load={()=>{ lazyLoadStatus = true }}>
  <img src={src.src} alt={text} width={width} style:aspect-ratio={`${width}/${height}`} />
</LazyLoad>

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
