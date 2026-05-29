<script>
  import { spriteSheet, cdn } from '../common'
  import TextImage from './textImage.svelte'
  import LazyLoad from './lazyLoad.svelte'
  import headIconCache from './spritesheetCache.js'

  let {
    file,
    name,
    rarity = null,
    element = null,
    showName = false,
    lazyLoad = true,
  } = $props()

  let lazyLoadStatus = $state(false)

  let spriteHead = $state(null)
  let spriteRarity = $state(null)
  let spriteRarityFrame = $state(null)
  let spriteElement = $state(null)
  let spriteElementFrame = $state(null)
  const loadSprite = ()=>{
    spriteHead = spriteSheet('head', ()=>file, 'cdn2')
    spriteRarity = spriteSheet('res/icon', ()=>{
      return {
        '5': 'rarity_five',
        '4': 'rarity_four',
        '3': 'rarity_three',
        '2': 'rarity_two',
        '1': 'rarity_one',
      }[rarity]
    }, 'cdn', headIconCache)
    spriteRarityFrame = spriteSheet('res/icon', ()=>rarity ? `rarity_background${rarity}` : null, 'cdn', headIconCache)
    spriteElement = spriteSheet('res/icon', ()=> {
      return {
        '0': 'element_red_medium',
        '1': 'element_blue_medium',
        '2': 'element_yellow_medium',
        '3': 'element_green_medium',
        '4': 'element_white_medium',
        '5': 'element_black_medium',
      }[element]
    }, 'cdn', headIconCache)
    spriteElementFrame = spriteSheet(
      'res/icon', ()=>`character_face_${element ? 'frame' : 'empty_frame'}`,
      'cdn', headIconCache,
    )
  }
  let finalHead = $state(null)
  $effect(()=>{
    if (!spriteHead?.canvas){ finalHead = null; return }
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
    let url = null
    let cancel = false
    canvas.toBlob((blob) => {
      if (cancel){ return }
      url = URL.createObjectURL(blob)
      finalHead = url
    })
    return ()=>{
      cancel = true
      URL.revokeObjectURL(url)
    }
  })
</script>

{#if !lazyLoadStatus}
  <LazyLoad lazy={lazyLoad} load={()=>{ lazyLoadStatus = true; loadSprite() }} lazyTime={200}>
    <img class="frame" alt={name}
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      style:aspect-ratio={showName ? "212/252" : "1/1"} />
  </LazyLoad>
{:else}
<div class="main"
  style:background-image={`url(${cdn('cdn', 'ui/party_thumbnail_tile_bg_old.png')})`}>
  {#if finalHead}
    <img src={finalHead} alt={name}>
  {:else}
    <TextImage
      text={name}
      width={212}
      height={showName ? 252 : 212}
      style={{ color: 'white', background: '#000000', size: '36px' }}
      lazyLoad={false}
    />
  {/if}
  {#if showName && finalHead}
    <TextImage
      text={name}
      width={212}
      height={40}
      style={{ color: 'white', background: '#333333', size: '28px' }}
      lazyLoad={false}
    />
  {/if}
</div>
{/if}

<style>
  .main, .frame{
    background-color: #232223;
    border-radius: 5px;
    line-height: 0;
  }
  .frame{
    width: 212px;
    max-width: 100%;
    border: 1px solid #aaa;
  }
  .main{
    overflow: hidden;
    max-width: 212px;
  }
  .main :global img, .main :global canvas{ width: 100% }
</style>
