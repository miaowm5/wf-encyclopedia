<script>
  import { SpriteLoader, TextImage } from '../ui'
  const { data } = $props()
</script>

<div class="item">
  <SpriteLoader file={data.item[1]} spritesheet="res/banner" alt={data.name[0]}>
    <TextImage text={data.name[0]} width={1000} height={184} />
  </SpriteLoader>
</div>

<style>
  .item{
    width: 100%;
    position: relative;
    border: 4px solid white;
    border-radius: 8px;
    overflow: hidden;
    line-height: 0;
    margin-bottom: .5em;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
  }
  .item :global > img {
    width: 100%;
  }
</style>
