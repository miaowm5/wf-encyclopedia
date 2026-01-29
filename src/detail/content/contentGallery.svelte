<script>
  import store from '../../store'
  import { Title, RoundButton, Loading } from '../../ui'
  import GalleryCharacter from './galleryCharacter.svelte'
  import GalleryPixel from './galleryPixel.svelte'
  import MobileBack from './mobileBack.svelte'
  import galleryEffectRule from '../../database/effectRule.json'

  const { item, itemType } = $props()

  const loadDB = store.database('character', 'story_character')

  const emotionList = $derived.by(()=>{
    if (!loadDB.finish){ return null }
    const database = loadDB.db.character
    const database2 = loadDB.db.story_character
    let id = null
    let hasPixel = false
    if (itemType === 'character'){
      id = database[item.characterID][0]
      if (database[item.characterID][2] === '5' || database[item.characterID][2] === '4'){ hasPixel = true }
    }else if (itemType === 'npc'){
      id = item.storyID
    }
    if (!id){ return null }
    if (!database2[id]){ return { id } }
    const list = []
    const effect = []
    let fullshot = 0
    let effectGroup = {}
    let rule = galleryEffectRule._common.include
    let emotionData = database2[id][3]
    if (galleryEffectRule[id]){
      let effectRule = galleryEffectRule[id]
      const include = effectRule.include || []
      const exclude = effectRule.exclude || []
      rule = rule.concat(...include)
      rule = rule.filter((name)=>!exclude.includes(name))
      if (effectRule.fullshot){ fullshot = effectRule.fullshot }
      if (effectRule.effectGroup){ effectGroup = effectRule.effectGroup }
      if (effectRule.extraCharacter){
        emotionData = { ...emotionData }
        effectRule.extraCharacter.forEach((exID, index)=>{
          if (!database2[exID]){ return }
          let exEmoList = database2[exID][3]
          Object.keys(exEmoList).forEach((name)=>{
            emotionData[`${name}_ex${index + 1}`] = exEmoList[name]
          })
        })
      }
    }
    Object.keys(emotionData).forEach((name)=>{
      const isEffect = rule.some((prefix)=>name.startsWith(prefix))
      if (isEffect){ effect.push(name); return }
      if (name){ list.push(name) }
    })
    effect.push('noface')
    // console.log(id)
    // console.log(list.join('\n'))
    return { id, list, effect, effectGroup, data: emotionData, fullshot, hasPixel }
  })

</script>

<div class="content">
<Loading finish={loadDB.finish} error={loadDB.error}>
  {#if emotionList && emotionList.list && emotionList.list.length > 0}
    <GalleryCharacter emotionList={emotionList} />
  {/if}
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
</Loading>
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
