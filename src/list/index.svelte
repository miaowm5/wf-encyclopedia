<script>
  import store from '../store'
  import { spriteSheet } from '../common'
  import { Loading } from '../ui'
  import IndexButton from './indexButton.svelte'
  import CharacterList from './characterList.svelte'
  import StoryList from './storyList.svelte'
  import AllList from './allList.svelte'
  import MusicPlayer from './musicPlayer/index.svelte'

  const loadDB = store.database('encyclopedia', 'character_text', 'character')

  const list = $derived.by(()=>{
    if (!loadDB.finish){ return [] }
    const database = loadDB.db.encyclopedia
    const database2 = loadDB.db.character_text
    const database3 = loadDB.db.character
    return Object.keys(database).map((id)=>{
      const item = database[id]
      let extra = {}
      let name = [item.title]
      if (item.type === 'character'){
        extra = database3[item.characterID]
        name = [database2[item.characterID][0], database2[item.characterID][3]]
      }
      return { id, name, item, extra }
    })
  })

  const category = $derived(store.state.ui.listCategory)

  const backSprite = spriteSheet('res/icon', 'return')
  const configSprite = spriteSheet('res/icon', 'option_small')
</script>

<div class={`main ${store.state.ui.mobileListHide ? 'mobileHide' : ''}`}>
  <div class="content">
    {#if category === null}
      <div class="titleButton">
        <div
          style:background-image={`url(${import.meta.env.VITE_CDN}ui/top_background.png)`}>
          <div
            style:background-image={`url(${import.meta.env.VITE_CDN}ui/encyclopedia_title.png)`}>
          </div>
        </div>
        <div>
          <IndexButton onclick={()=>store.changeListCategory('character')} id="character_archive" text={store.i18n("list.category1")} />
          <IndexButton onclick={()=>store.changeListCategory('story')} id="world_archive" text={store.i18n("list.category2")} />
          <IndexButton onclick={()=>store.changeListCategory('all')} id="all_keyword" text={store.i18n("list.category3")} />
        </div>
      </div>
    {:else}
      <Loading finish={loadDB.finish} error={loadDB.error}>
        {#if category === 'character'}
          <CharacterList list={list} select={store.state.item} />
        {:else if category === 'story'}
          <StoryList list={list} select={store.state.item} />
        {:else if category === 'all'}
          <AllList list={list} select={store.state.item} />
        {/if}
      </Loading>
    {/if}
    {#if category !== null}
      {@const text = store.i18n("list.categoryBack")}
      <button onclick={()=>store.changeListCategory(null)} class="back">
        <img src={backSprite.src} alt={text}>
        {text}
      </button>
    {:else if store.state.ui.page !== 'config'}
      {@const text = store.i18n("list.categoryConfig")}
      <button onclick={()=>store.route.push('/config', true)} class="back">
        <img src={configSprite.src} alt={text}>
        {text}
      </button>
    {/if}
  </div>
  <MusicPlayer />
</div>

<style>
  .main{
    flex: 2;
    max-width: 500px;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .content{
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .back{
    position: absolute;
    bottom: 0;
    left: 0;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    padding: .5em 1.3em .4em;
    box-shadow: 0 0 3px 1px rgba(0,0,0,.2);
    display: flex;
    flex-direction: column;
    font-size: .8em;
  }
  .back > img{
    width: 2.5em;
  }
  .titleButton{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .titleButton>div:nth-child(1){
    width: 100%;
    height: 10em;
    max-height: 30%;
    background-size: 130%;
    background-position: center;
    flex: 0;
    position: relative;
  }
  @supports (aspect-ratio: 2/1){
    .titleButton>div:nth-child(1){
      aspect-ratio: 2/1;
      height: auto;
    }
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
    padding: 1em .5em 5em;
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
