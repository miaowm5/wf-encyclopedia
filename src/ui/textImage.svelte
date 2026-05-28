<script>
  import LazyLoad from './lazyLoad.svelte'

  let {
    text,
    width,
    height,
    lazyLoad = true,
    style = {},
  } = $props()

  const draw = (canvas)=>{
    $effect(()=>{
      const {
        color = 'white',
        background = '#000000',
        size = '36px',
      } = style
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, width, height)
      if (background){
        ctx.fillStyle = background
        ctx.fillRect(0, 0, width, height)
      }
      ctx.font = `${size} sans-serif`
      ctx.fillStyle = color
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text, width / 2, height / 2, width)
    })
  }
</script>

<LazyLoad lazy={lazyLoad}>
  {#snippet loadChildren()}
    <canvas {width} {height} style:aspect-ratio={`${width}/${height}`} {@attach draw}></canvas>
  {/snippet}
</LazyLoad>

<style>
  canvas{
    max-width: 100%;
    max-height: 100%;
    height: auto;
  }
</style>
