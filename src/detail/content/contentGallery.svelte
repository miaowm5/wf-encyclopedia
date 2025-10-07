<script>
  import store from '../../store'
  import { Title, RoundButton } from '../../ui'
  import GalleryCharacter from './galleryCharacter.svelte'
  import GalleryPixel from './galleryPixel.svelte'
  import MobileBack from './mobileBack.svelte'
  import galleryEffectRule from './galleryEffectRule.json'

  const { item, itemType } = $props()

  const database = store.state.database.character
  const database2 = store.state.database.story_character

  const emotionList = $derived.by(()=>{
    let id = null
    let hasPixel = false
    if (itemType === 'character'){
      id = database[item[0][5]][0]
      if (database[item[0][5]][2] === '5' || database[item[0][5]][2] === '4'){ hasPixel = true }
    }else if (itemType === 'npc'){
      id = item[0][6]
    }
    if (!id){ return null }
    if (!database2[id]){ return { id } }
    const list = []
    const effect = []
    let fullshot = 0
    let rule = galleryEffectRule._common
    if (galleryEffectRule[id]){
      const include = galleryEffectRule[id].include || []
      const exclude = galleryEffectRule[id].exclude || []
      rule = rule.concat(...include)
      rule = rule.filter((name)=>!exclude.includes(name))
      if (galleryEffectRule[id].fullshot){ fullshot = galleryEffectRule[id].fullshot }
    }
    Object.keys(database2[id][3]).forEach((name)=>{
      const isEffect = rule.some((prefix)=>name.startsWith(prefix))
      if (isEffect){ effect.push(name); return }
      list.push(name)
    })
    effect.push('noface')
    return { id, list, effect, data: database2[id][3], fullshot, hasPixel }
  })

</script>

<div class="content">
  <GalleryCharacter emotionList={emotionList} />
  {#snippet image(title, image)}
    {@const url = import.meta.env.VITE_CDN2 + `fullshot/${image}.png`}
    <Title>{title}</Title>
    <div class="image"
      style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/party_thumbnail_tile_bg_old.png'})`}>
      <img src={url} alt={image} />
      <RoundButton icon="full_size" onclick={()=>window.open(url)} />
    </div>
  {/snippet}
  {#if itemType === 'character'}
    {@render image(store.i18n("detail.content.title3"), `${emotionList.id}_0`)}
    {@render image(store.i18n("detail.content.title4"), `${emotionList.id}_1`)}
  {:else if emotionList.fullshot > 0}
    {#if emotionList.fullshot >= 1}
      {@render image(store.i18n("detail.content.title8"), `${emotionList.id}_0`)}
    {/if}
    {#if emotionList.fullshot >= 2}
      {@render image(store.i18n("detail.content.title9"), `${emotionList.id}_1`)}
    {/if}
  {/if}
  {#if itemType === 'character'}
    <GalleryPixel emotionList={emotionList} />
  {/if}
  <MobileBack />
</div>

<style>
  .image{
    width: 100%;
    height: 50vh;
    background-color: #232223;
    position: relative;
    padding: 1em;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .image img{
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    display: block;
  }
  .content{
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
    overflow-x: hidden;
    position: relative;
  }
  .image :global button{
    position: absolute;
    right: 1em;
    bottom: 1em;
  }
</style>
