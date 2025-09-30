<script>
  import TextImage from './textImage.svelte'
  import SpriteLoader from './spriteLoader.svelte'

  let {
    file,
    name,
    lazyLoad = true,
  } = $props()

</script>

<div class="border1"><div class="border2"
  style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/party_thumbnail_tile_bg_old.png'})`}>
  <SpriteLoader
    spritesheet="character/head2"
    file={file}
    alt={name}
    lazyLoad={lazyLoad}
  >
    <TextImage
      text={name}
      width={212}
      height={212}
      style={{ color: 'white', background: '#000000', size: '36px' }}
      lazyLoad={lazyLoad}
    />
  </SpriteLoader>
</div></div>

<style>
  .border2{
    border: 1px solid #ababab;
    background-color: #232223;
  }
  .border1{
    border: 4px solid white;
  }
  .border2 :global img{ width: 100% }
</style>
