<script>
  import store from '../store'
  import CharacterList from './characterList.svelte'
  import StoryList from './storyList.svelte'
  import AllList from './allList.svelte'
  const database = store.state.database.encyclopedia
  const database2 = store.state.database.character_text

  const list = $derived.by(()=>{
    return Object.keys(database).map((id)=>{
      const item = database[id][0]
      let extra = {}
      let name = [item[17]]
      if (item[4] === '0' || item[4] === '1'){
        extra = database2[item[5]]
        name = [extra[0], extra[3]]
      }
      return { id, name, item, extra }
    })
  })

  const category = $derived(store.state.ui.listCategory)

</script>

<div class={`main ${store.state.ui.mobileListHide ? 'mobileHide' : ''}`}>
  {#if category === null}
    <button onclick={()=>store.changeCategory('character')}>character</button>
    <button onclick={()=>store.changeCategory('story')}>story</button>
    <button onclick={()=>store.changeCategory('all')}>all</button>
  {:else if category === 'character'}
    <CharacterList list={list} select={store.state.item} />
  {:else if category === 'story'}
    <StoryList list={list} select={store.state.item} />
  {:else if category === 'all'}
    <AllList list={list} select={store.state.item} />
  {/if}
  {#if category !== null}
    <button onclick={()=>store.changeCategory(null)} >back</button>
  {/if}
</div>

<style>
  .main{
    flex: 2;
    max-width: 500px;
    overflow: auto;
    padding: 1em 1em 10em 1em;
  }
  @media (max-width: 800px) {
    .main{
      flex: 1;
      max-width: 100%;
    }
    .mobileHide{
      display: none;
    }
  }
</style>
