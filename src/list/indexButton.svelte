<script>
  import imageButtonSrc from './imageButtonSrc.svelte.js'
  const {id, onclick} = $props()
  const image = $derived.by(()=>{
    return imageButtonSrc(`ui/${id}_btn`, id, 992, 352)
  })
</script>

<button
  onclick={onclick}
  aria-label={id}
><img src={image.src} alt={id}></button>

<style>
  button{
    width: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: none;
  }
  img{
    max-width: 100%;
  }
</style>
