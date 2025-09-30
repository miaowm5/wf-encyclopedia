<script>
  import { textImage } from "../common"
  import lazyLoadWrap from './lazyLoad.svelte.js'

  let {
    text,
    width,
    height,
    lazyLoad = true,
    style = {},
  } = $props()

  let node = $state(null)
  let lazyLoadStatus = lazyLoadWrap(()=>node, lazyLoad)
  const src = $derived.by(()=>{
    if (!lazyLoadStatus.load){
      return `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`
    }
    return textImage(text, width, height, style).toDataURL("image/png")
  })
</script>

{#if !lazyLoadStatus.load}<span bind:this={node}></span>{/if}
<img src={src} alt={text} width={width} height={height}>

<style>
  img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
