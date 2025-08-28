<script>
  import imageButtonSrc from './imageButtonSrc.svelte.js'
  const { data, active } = $props()
  const image = $derived.by(()=>{
    return imageButtonSrc(`banner/${data.item[1]}`, data.name[0], 1000, 184)
  })
</script>

<div class={`item ${active ? 'active' : ''}`}><img src={image.src} alt={data.name[0]}></div>

<style>
  .item{
    width: 100%;
    position: relative;
  }
  .item>img{
    width: 100%;
  }
</style>
