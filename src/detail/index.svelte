<script>
  import store from '../store'
  import Title from './title/index.svelte'
  import Content from './content/index.svelte'
  import Scenario from './scenario/index.svelte'

  const loadDB = store.database('encyclopedia', 'character')

  const item = $derived.by(()=>{
    const id = store.state.item
    if (!store.state.item){ return null }
    if (!loadDB.finish){ return null }
    const data = loadDB.db.encyclopedia[id]
    return data
  })
  const character = $derived.by(()=>{
    if (!item || item.type !== 'character'){ return null }
    if (!loadDB.finish){ return null }
    return loadDB.db.character[item.characterID]
  })

  const tab = $derived.by(()=>{
    if (!item){ return stateTab }
    const stateTab = store.state.ui.detailTab
    if (stateTab === 'gallery'){
      if (item.type === 'story'){
        if (item.subType !== 'main'){ return 'info' }
      }else if (item.type !== 'character' && item.type !== 'npc'){
        return 'info'
      }
    }
    if (stateTab === 'story'){
      if (item.type === 'character'){
        if (!character){ return 'info' }
        const rarity = character[2]
        if (rarity !== '3' && rarity !== '4' && rarity !== '5'){
          return 'info'
        }
      }else if (item.type !== 'story'){
        return 'info'
      }
    }
    if (stateTab === 'voice'){
      if (item.type !== 'character'){ return 'info' }
    }
    return stateTab
  })

</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  {#if store.state.scenario}
    <Scenario scenario={store.state.scenario} />
  {/if}
  {#if item}{#key store.state.item}
    <span class={[store.state.scenario && 'hide', 'body']}>
      <Title item={item} itemType={item.type} tab={tab} extra={store.state.extra} />
      <Content item={item} itemType={item.type} tab={tab} extra={store.state.extra} />
    </span>
  {/key}{/if}
</div>

<style>
  .main{
    flex: 3;
    position: relative;
  }
  .hide{
    display: none;
  }
  .body{
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  @media (max-width: 800px) {
    .mobileHide{
      display: none;
    }
  }
</style>
