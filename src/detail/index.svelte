<script>
  import store from '../store'
  import ContentTitle from './contentTitle.svelte'
  import ContentInfo from './contentInfo.svelte'

  const database = store.state.database.encyclopedia

  const item = $derived.by(()=>{
    const id = store.state.item
    if (!store.state.item){ return null }
    const data = database[id]
    return data
  })
</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  {#if item}{#key store.state.item}
    <ContentTitle item={item} />
    <ContentInfo item={item} store={store} />
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
