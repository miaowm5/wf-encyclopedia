<script>
  import store from '../../store'
  import { Title, RoundButton } from '../../ui'
  import GalleryCharacter from './galleryCharacter.svelte'
  import MobileBack from './mobileBack.svelte'
  import galleryEffectRule from './galleryEffectRule.json'

  const { item, itemType } = $props()

  const database = store.state.database.character
  const database2 = store.state.database.story_character

  const emotionList = $derived.by(()=>{
    let id = null
    if (itemType === 'character'){
      id = database[item[0][5]][0]
    }else if (itemType === 'npc'){
      id = item[0][6]
    }
    if (!id){ return null }
    if (!database2[id]){ return { id } }
    const list = []
    const effect = []
    let rule = galleryEffectRule._common
    if (galleryEffectRule[id]){
      const include = galleryEffectRule[id].include || []
      const exclude = galleryEffectRule[id].exclude || []
      rule = rule.concat(...include)
      rule = rule.filter((name)=>!exclude.includes(name))
    }
    Object.keys(database2[id][3]).forEach((name)=>{
      const isEffect = rule.some((prefix)=>name.startsWith(prefix))
      if (isEffect){ effect.push(name); return }
      list.push(name)
    })
    effect.push('noface')
    return { id, list, effect, data: database2[id][3] }
  })

</script>

<div class="content">
  <GalleryCharacter item={item} itemType={itemType} emotionList={emotionList} />
  {#if itemType === 'character'}
    {#snippet image(title, image)}
      {@const url = import.meta.env.VITE_CDN2 + `fullshot/${image}.png`}
      <Title>{title}</Title>
      <div class="image2"
        style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/party_thumbnail_tile_bg_old.png'})`}>
        <img src={url} alt={image} class="img">
        <RoundButton icon="full_size" onclick={()=>window.open(url)} />
      </div>
    {/snippet}
    {@render image(store.i18n("detail.content.title3"), `${emotionList.id}_0`)}
    {@render image(store.i18n("detail.content.title4"), `${emotionList.id}_1`)}
  {/if}
  <MobileBack />
</div>

<style>
  .image2{
    width: 100%;
    height: 80%;
    text-align: center;
    background-color: #232223;
    position: relative;
  }
  .image2{
    padding: 1em;
  }
  .img{
    max-width: 100%;
    max-height: 100%;
  }
  .content{
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
  }
  .image2 :global button{
    border-radius: 50%;
    background-position: center center;
    width: 2em;
    height: 2em;
    margin-left: .3em;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 1em;
    bottom: 1em;
    background-color: #fafafa;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
  }
</style>
