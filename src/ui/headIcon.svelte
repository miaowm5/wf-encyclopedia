<script>
  import { spriteSheet } from '../common'
  import TextImage from './textImage.svelte'
  import LazyLoad from './lazyLoad.svelte'

  let {
    file,
    name,
    rarity = null,
    element = null,
    showName = false,
    lazyLoad = true,
  } = $props()

  let lazyLoadStatus = $state(false)

  const spriteHead = $derived.by(()=>{
    if (!lazyLoadStatus){ return null }
    return spriteSheet('character/head2', file)
  })
  const spriteRarity = $derived.by(()=>{
    if (!rarity || !lazyLoadStatus){ return null }
    const file = {
      '5': 'rarity_five',
      '4': 'rarity_four',
      '3': 'rarity_three',
      '2': 'rarity_two',
      '1': 'rarity_one',
    }[rarity]
    if (!file){ return null }
    return spriteSheet('res/icon', file)
  })
  const spriteRarityFrame = $derived.by(()=>{
    if (!rarity || !lazyLoadStatus){ return null }
    return spriteSheet('res/icon', `rarity_background${rarity}`)
  })
  const spriteElement = $derived.by(()=>{
    if (!element || !lazyLoadStatus){ return null }
    const file = {
      '0': 'element_red_medium',
      '1': 'element_blue_medium',
      '2': 'element_yellow_medium',
      '3': 'element_green_medium',
      '4': 'element_white_medium',
      '5': 'element_black_medium',
    }[element]
    if (!file){ return null }
    return spriteSheet('res/icon', file)
  })
  const spriteElementFrame = $derived.by(()=>{
    if (!lazyLoadStatus){ return null }
    if (!element){
      return spriteSheet('res/icon', 'character_face_empty_frame')
    }
    return spriteSheet('res/icon', 'character_face_frame')
  })
  const finalHead = $derived.by(()=>{
    if (!lazyLoadStatus){ return null }
    if (!spriteHead?.canvas){ return null }
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 212
    canvas.height = 212
    ctx.drawImage(spriteHead.canvas,
      0, 0, 212, 212,
      14, 14, 184, 184
    )
    if (spriteElementFrame?.canvas){
      ctx.drawImage(spriteElementFrame.canvas, 0, 0)
    }
    if (spriteElement?.canvas){
      ctx.drawImage(spriteElement.canvas,
        0, 0, 61, 61,
        154, 10, 48, 48
      )
    }
    if (spriteRarityFrame?.canvas){
      ctx.drawImage(spriteRarityFrame.canvas, 0, 177)
    }
    if (spriteRarity?.canvas){
      ctx.drawImage(spriteRarity.canvas, 4, 180)
    }
    return canvas.toDataURL("image/png")
  })
</script>

{#if !lazyLoadStatus}
  <LazyLoad lazy={lazyLoad} load={()=>{ lazyLoadStatus = true }}></LazyLoad>
  <img class="frame" alt={name}
    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    style:aspect-ratio={showName ? "212/252" : "1/1"} />
{:else}
<div class="main"
  style:background-image={`url(${import.meta.env.VITE_CDN}ui/party_thumbnail_tile_bg_old.png)`}>
  {#if finalHead}
    <img src={finalHead} alt={name}>
  {:else}
    <TextImage
      text={name}
      width={212}
      height={212}
      style={{ color: 'white', background: '#000000', size: '36px' }}
      lazyLoad={lazyLoad}
    />
  {/if}
  {#if showName}
    <TextImage
      text={name}
      width={212}
      height={40}
      style={{ color: 'white', background: '#333333', size: '28px' }}
      lazyLoad={lazyLoad}
    />
  {/if}
</div>
{/if}

<style>
  .frame{
    width: 212px;
    max-width: 100%;
  }
  .main{
    background-color: #232223;
    border-radius: 5px;
    overflow: hidden;
    max-width: 212px;
    line-height: 0;
  }
  .main :global img{ width: 100% }
</style>
