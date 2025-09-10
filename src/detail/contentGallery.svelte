<script>
  import { characterShot } from '../common'
  import { Title } from '../ui'
  import MobileBack from './mobileBack.svelte'
  import galleryEffectRule from './galleryEffectRule.json'

  const { item, store, itemType } = $props()

  const database = store.state.database.character
  const database2 = store.state.database.story_character

  let index = $state(0)
  let selectEffect = $state([])

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

  const emoData = $derived.by(()=>{
    if (!emotionList || !emotionList.list){ return null }
    let emoName = emotionList.list[index]
    let emoData = emotionList.data[emoName]
    return { name: emoName, data: emoData }
  })

  const useAbleEffect = $derived.by(()=>{
    if (!emotionList || !emotionList.list){ return [] }
    return emotionList.effect.filter((name)=>{
      if (name === 'noface'){ return Boolean(emoData.data.front) }
      let item = emotionList.data[name]
      if (item.back !== emoData.data.back){ return false }
      return true
    })
  })

  const bannerImage = $derived.by(()=>{
    if (!emoData){ return null }
    let effect = []
    selectEffect.forEach((name)=>{
      if (name === 'noface'){ return }
      let item = emotionList.data[name]
      if (item.back !== emoData.data.back){ return }
      effect.push(item.front)
    })
    return characterShot(emoData.data.back,
      selectEffect.includes('noface') ? null : emoData.data.front,
      effect
    )
  })

  const changeIndex = (offset)=>{
    index += offset
    if (index < 0){ index += emotionList.list.length }
    index = index % emotionList.list.length
  }

  const triggerEffect = (name)=>{
    if (selectEffect.includes(name)){
      selectEffect = selectEffect.filter((v)=> v !== name)
    }else{
      selectEffect.push(name)
    }
  }
</script>

<div class="content">
  {#if emoData}
    <Title>表情</Title>
    <div class="image1"
      style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/party_thumbnail_tile_bg_old.png'})`}>
      {#if bannerImage.src}
        <img src={bannerImage.src} alt={`${emotionList.id}-${emoData.name}`} class="img">
      {/if}
    </div>
    {#if emotionList.list.length > 1}
      <div class="nav">
        <button onclick={()=>{ changeIndex(-1) }}>last</button>
        <p>{emoData.name}</p>
        <button onclick={()=>{ changeIndex(1) }}>next</button>
      </div>
    {/if}
    {#if useAbleEffect.length > 0}
      <div class="effectList">
        {#each useAbleEffect as effect}
          <button
            class={`effect ${selectEffect.includes(effect) ? 'active' : ''}`}
            onclick={()=>triggerEffect(effect)}>
            {effect}
          </button>
        {/each}
      </div>
    {/if}
  {/if}
  {#if itemType === 'character'}
    {#snippet image(title, image)}
      <Title>{title}</Title>
      <div class="image2"
        style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/party_thumbnail_tile_bg_old.png'})`}>
        <img src={import.meta.env.VITE_CDN2 + `fullshot/${image}.png`} alt={image} class="img">
        <a
          class="openImage" aria-label="Open In New Window"
          href={import.meta.env.VITE_CDN2 + `fullshot/${image}.png`} target="_blank"
          style:background-image={`url(${import.meta.env.VITE_CDN}ui/icon/full_size.png?082701`}>
        </a>
      </div>
    {/snippet}
    {@render image('普通立绘', `${emotionList.id}_0`)}
    {@render image('觉醒立绘', `${emotionList.id}_1`)}
  {/if}
  <MobileBack />
</div>

<style>
  .image1, .image2{
    width: 100%;
    height: 80%;
    text-align: center;
    background-color: #232223;
    position: relative;
  }
  .image1{
    max-height: 690px;
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
  .effectList{
    margin-top: 1em;
  }
  .effect{
    padding: .3em 1.5em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
  .effect.active{
    border-top: none;
    background-color: #ffcf8f;
  }
  .nav{
    display: flex;
    width: 100%;
    margin-top: .5em;
  }
  .nav>p{
    flex: 1;
    text-align: center;
  }
  .nav>button{
    padding: .3em 1.5em;
    border-top: 1px solid white;
    border-radius: 10px;
  }
  .openImage{
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
