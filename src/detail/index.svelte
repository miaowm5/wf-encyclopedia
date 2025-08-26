<script>
  import store from '../store'
  import ContentTitle from './contentTitle.svelte'
  import ContentInfo from './contentInfo.svelte'
  import ContentGallery from './contentGallery.svelte'

  const database = store.state.database.encyclopedia

  const item = $derived.by(()=>{
    const id = store.state.item
    if (!store.state.item){ return null }
    const data = database[id]
    return data
  })
  const tab = $derived(store.state.ui.detailTab)
  const itemType = $derived.by(()=>{
    if (item[0][4] === '0' || item[0][4] === '1'){ return 'character' }
    if (item[0][4] === '2'){ return 'npc' }
    if (item[0][4] === '3' || item[0][4] === '4'){ return 'story' }
    return 'normal'
  })
</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  {#if item}{#key store.state.item}
    <ContentTitle item={item} />
    {#if (itemType !== 'character' && itemType !== 'npc') || tab === 'info'}
      <ContentInfo item={item} store={store} />
    {:else if tab === 'gallery'}
      <ContentGallery item={item} store={store} />
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
