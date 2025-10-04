<script>
  import store from '../store'
  import IndexButton from './indexButton.svelte'
  import CharacterList from './characterList.svelte'
  import StoryList from './storyList.svelte'
  import AllList from './allList.svelte'
  const database = store.state.database.encyclopedia
  const database2 = store.state.database.character_text
  const database3 = store.state.database.character

  const list = $derived.by(()=>{
    return Object.keys(database).map((id)=>{
      const item = database[id][0]
      let extra = {}
      let name = [item[17]]
      if (item[4] === '0' || item[4] === '1'){
        extra = database3[item[5]]
        name = [database2[item[5]][0], database2[item[5]][3]]
      }
      return { id, name, item, extra }
    })
  })

  const category = $derived(store.state.ui.listCategory)

</script>

<div class={`main ${store.state.ui.mobileListHide ? 'mobileHide' : ''}`}>
  {#if category === null}
    <div class="titleButton">
      <div
        style:background-image={`url(${import.meta.env.VITE_CDN}ui/top_background.png)`}>
        <div
          style:background-image={`url(${import.meta.env.VITE_CDN}ui/encyclopedia_title.png)`}>
        </div>
      </div>
      <div>
        <IndexButton onclick={()=>store.changeCategory('character')} id="character_archive" text={store.i18n("list.category1")} />
        <IndexButton onclick={()=>store.changeCategory('story')} id="world_archive" text={store.i18n("list.category2")} />
        <IndexButton onclick={()=>store.changeCategory('all')} id="all_keyword" text={store.i18n("list.category3")} />
      </div>
    </div>
  {:else if category === 'character'}
    <CharacterList list={list} select={store.state.item} />
  {:else if category === 'story'}
    <StoryList list={list} select={store.state.item} />
  {:else if category === 'all'}
    <AllList list={list} select={store.state.item} />
  {/if}
  {#if category !== null}
    <button onclick={()=>store.changeCategory(null)} class="back">{store.i18n("list.categoryBack")}</button>
  {/if}
</div>

<style>
  .main{
    flex: 2;
    max-width: 500px;
  }
  .back{
    position: absolute;
    bottom: 0;
    left: 0;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    padding: 1.5em;
    box-shadow: 0 0 3px 1px rgba(0,0,0,.2);
  }
  .titleButton{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .titleButton>div:nth-child(1){
    width: 100%;
    aspect-ratio: 2/1;
    max-height: 30%;
    background-size: 130%;
    background-position: center;
    flex: 0;
    position: relative;
  }
  .titleButton>div:nth-child(1)>div{
    position: absolute;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: right bottom;
    height: 50%;
    width: 50%;
    right: 0;
    bottom: 0
  }

  .titleButton>div:nth-child(2){
    overflow: auto;
    flex: 1;
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
