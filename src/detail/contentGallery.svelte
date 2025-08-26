<script>
  import { characterShot } from '../common'
  import MobileBack from './mobileBack.svelte'

  const { item, store } = $props()

  const database = store.state.database.character
  const database2 = store.state.database.story_character

  let index = $state(0)
  let selectEffect = $state([])

  const emotionList = $derived.by(()=>{
    let id = null
    if (item[0][4] === '0' || item[0][4] === '1'){
      id = database[item[0][5]][0]
    }else if (item[0][4] === '2'){
      id = item[0][6]
    }
    if (!id){ return null }
    if (!database2[id]){ return null }
    const list = []
    const effect = []
    Object.keys(database2[id][3]).forEach((name)=>{
      if (name.startsWith('shame')){ effect.push(name); return }
      if (name.startsWith('sweat')){ effect.push(name); return }
      if (name.startsWith('cheek')){ effect.push(name); return }
      if (name.startsWith('blood')){ effect.push(name); return }
      if (name.startsWith('tear')){ effect.push(name); return }
      if (name.startsWith('item')){ effect.push(name); return }
      if (name.startsWith('effect')){ effect.push(name); return }
      list.push(name)
    })
    return { list, effect, data: database2[id][3] }
  })

  const emoData = $derived.by(()=>{
    if (!emotionList){ return null }
    let emoName = emotionList.list[index]
    let emoData = emotionList.data[emoName]
    return { name: emoName, data: emoData }
  })

  const useAbleEffect = $derived.by(()=>{
    return emotionList.effect.filter((name)=>{
      let item = emotionList.data[name]
      if (item.back !== emoData.data.back){ return }
      return name
    })
  })

  const bannerImage = $derived.by(()=>{
    if (!emoData){ return null }
    let effect = []
    selectEffect.forEach((name)=>{
      let item = emotionList.data[name]
      if (item.back !== emoData.data.back){ return }
      effect.push(item.front)
    })
    return characterShot(emoData.data.back, emoData.data.front, effect)
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
  {#if bannerImage && bannerImage.src}
    {#if bannerImage.src}
      <img src={bannerImage.src} alt={emotionList.list[index]} class="img">
    {/if}
    <button onclick={()=>{ changeIndex(-1) }}>last</button>
    <button onclick={()=>{ changeIndex(1) }}>next</button>
    {#each useAbleEffect as effect}
      <button
        class={`effect ${selectEffect.includes(effect) ? 'active' : ''}`}
        onclick={()=>triggerEffect(effect)}>
        {effect}
      </button>
    {/each}
  {/if}
  <MobileBack />
</div>

<style>
  .img{
    max-width: 200px;
  }
  .content{
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
  }
  .effect{
    background-color: grey;
  }
  .effect.active{
    background-color: yellow;
  }
</style>
