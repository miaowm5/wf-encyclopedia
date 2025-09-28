<script>
  import { SpriteLoader, TextImage } from '../ui'
  const { data, active } = $props()
</script>

<div class={`item ${active ? 'active' : ''}`}>
  <SpriteLoader file={data.item[1]} spritesheet="res/banner" alt={data.name[0]}>
    <TextImage text={data.name[0]} width={1000} height={184} />
  </SpriteLoader>
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
