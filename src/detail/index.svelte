<script>
  import store from '../store'
  import Title from './title/index.svelte'
  import Content from './content/index.svelte'
  import Scenario from './scenario/index.svelte'

  const database = store.state.database.encyclopedia
  const database2 = store.state.database.character

  const item = $derived.by(()=>{
    const id = store.state.item
    if (!store.state.item){ return null }
    const data = database[id]
    return data
  })
  const itemType = $derived.by(()=>{
    if (item[0][4] === '0' || item[0][4] === '1'){ return 'character' }
    if (item[0][4] === '2'){ return 'npc' }
    if (item[0][4] === '3' || item[0][4] === '4'){ return 'story' }
    return 'normal'
  })
  const character = $derived.by(()=>{
    if (itemType !== 'character'){ return null }
    return database2[item[0][5]]
  })

  const tab = $derived.by(()=>{
    const stateTab = store.state.ui.detailTab
    if (stateTab === 'gallery'){
      if (itemType !== 'character' && itemType !== 'npc'){ return 'info' }
    }
    if (stateTab === 'story'){
      if (itemType === 'character'){
        if (!character){ return 'info' }
        const rarity = character[2]
        if (rarity !== '3' && rarity !== '4' && rarity !== '5'){
          return 'info'
        }
      }else if (itemType !== 'story'){
        return 'info'
      }
    }
    if (stateTab === 'voice'){
      if (itemType !== 'character'){ return 'info' }
    }
    return stateTab
  })

</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  {#if store.state.scenario}
    <Scenario scenario={store.state.scenario} />
  {:else if item}{#key store.state.item}
    <Title item={item} itemType={itemType} tab={tab} />
    <Content item={item} itemType={itemType} tab={tab} />
  {/key}{/if}
</div>

<style>
  .main{
    flex: 3;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 800px) {
    .mobileHide{
      display: none;
    }
  }
</style>
