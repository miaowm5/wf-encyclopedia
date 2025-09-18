<script>
  import store from '../store'
  import ContentTitle from './title/index.svelte'
  import ContentInfo from './contentInfo.svelte'
  import ContentGallery from './contentGallery.svelte'
  import ContentVoice from './contentVoice.svelte'

  const database = store.state.database.encyclopedia

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

  const tab = $derived.by(()=>{
    const stateTab = store.state.ui.detailTab
    if (itemType !== 'character' && itemType !== 'npc'){ return 'info' }
    if (stateTab === 'story'){
      if (itemType !== 'character' && itemType !== 'story'){ return 'info' }
    }
    if (stateTab === 'voice' || stateTab === 'story'){
      if (itemType !== 'character'){ return 'info' }
    }
    return stateTab
  })

</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  {#if item}{#key store.state.item}
    <ContentTitle item={item} itemType={itemType} tab={tab} />
    {#if tab === 'info'}
      <ContentInfo item={item} store={store} />
    {:else if tab === 'gallery'}
      <ContentGallery item={item} store={store} itemType={itemType} />
    {:else if tab === 'voice'}
      <ContentVoice item={item} store={store} itemType={itemType} />
    {:else if tab === 'story'}
      <ContentGallery item={item} store={store} itemType={itemType} />
    {/if}
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
