<script>
  import { ImageLoader, TextImage } from '../ui'
  const { data, active } = $props()
</script>

<div class={`item ${active ? 'active' : ''}`}>
  <ImageLoader src={`${import.meta.env.VITE_CDN}ui/banner/${data.item[1]}.png`} alt={data.name[0]}>
    <TextImage text={data.name[0]} width={1000} height={184} />
  </ImageLoader>
</div>

<style>
  .item{
    width: 100%;
    position: relative;
  }
  .item :global > img {
    width: 100%;
  }
</style>
