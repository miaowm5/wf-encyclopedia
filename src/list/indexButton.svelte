<script>
  import { cdn } from '../common'
  import { ImageLoader, TextImage } from '../ui'
  const {id, text, onclick} = $props()
</script>

<button onclick={onclick} aria-label={text}>
  <ImageLoader src={`${cdn('cdn')}ui/${id}_btn.png`} alt={text}>
    <TextImage text={text} width={992} height={352} />
  </ImageLoader>
</button>

<style>
  button{
    width: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: none;
    margin-bottom: .5em;
  }
</style>
