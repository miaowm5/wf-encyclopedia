<script>
  import store from '../../store'
  import { characterShot } from '../../common'
  import { Title } from '../../ui'

  const { emotionList } = $props()

  let index = $state(0)
  let selectEffect = $state([])

  const emoData = $derived.by(()=>{
    if (!emotionList || !emotionList.list){ return null }
    let emoName = emotionList.list[index]
    let emoData = emotionList.data[emoName]
    return { name: emoName, data: emoData }
  })

  const checkUseable = (name)=>{
    if (!emoData){ return false }
    let item = emotionList.data[name]
    const result = item.back === emoData.data.back
    const specialEffect = emotionList.effectGroup[name]
    if (!specialEffect){ return result }
    if (specialEffect.only){ return specialEffect.only.includes(emoData.name) }
    if (!result && specialEffect.include){ return specialEffect.include.includes(emoData.name) }
    if (result && specialEffect.exclude){ return !specialEffect.exclude.includes(emoData.name) }
    return result
  }

  const useAbleEffect = $derived.by(()=>{
    if (!emoData){ return [] }
    return emotionList.effect.filter((name)=>{
      if (name === 'noface'){ return Boolean(emoData.data.front) }
      return checkUseable(name)
    })
  })

  const cacheMap = {}
  const cache = {
    get: (key)=>{ return cacheMap[key] },
    set: (key, canvas)=>{ cacheMap[key] = canvas },
  }

  const bannerImage = $derived.by(()=>{
    if (!emoData){ return null }
    let effect = []
    selectEffect.forEach((name)=>{
      if (name === 'noface'){ return }
      let item = emotionList.data[name]
      if (!checkUseable(name)){ return }
      effect.push(item.front)
    })
    return characterShot(emoData.data.back,
      selectEffect.includes('noface') ? null : emoData.data.front,
      effect, cache
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

{#if emoData}
  <Title>{store.i18n("detail.content.title2")}</Title>
  <div class="image1"
    style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/party_thumbnail_tile_bg_old.png'})`}>
    {#if bannerImage.src}
      <img src={bannerImage.src} alt={`${emotionList.id}-${emoData.name}`} class="img">
    {/if}
  </div>
  {#if emotionList.list.length > 1}
    <div class="nav">
      <button onclick={()=>{ changeIndex(-1) }}>{store.i18n("detail.content.galleyCharacter1")}</button>
      <p>{emoData.name}</p>
      <button onclick={()=>{ changeIndex(1) }}>{store.i18n("detail.content.galleyCharacter2")}</button>
    </div>
  {/if}
  {#if useAbleEffect.length > 0}
    <div class="effectList">
      {#each useAbleEffect as effect}
        <button
          class={['effect', selectEffect.includes(effect) && 'active']}
          onclick={()=>triggerEffect(effect)}>
          {effect}
        </button>
      {/each}
    </div>
  {/if}
{/if}

<style>
  .image1{
    width: 100%;
    height: 80%;
    text-align: center;
    background-color: #232223;
    position: relative;
    max-height: 690px;
    line-height: 0;
  }
  .img{
    max-width: 100%;
    max-height: 100%;
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
    overflow: hidden;
    word-break: break-all;
  }
  .nav>button{
    padding: .3em 1.5em;
    border-top: 1px solid white;
    border-radius: 10px;
  }
  @media (max-width: 500px) {
    .image1{ height: auto; }
  }
</style>
