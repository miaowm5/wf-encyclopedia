<script>
  import store from '../store'
  import { Loading } from '../ui'
  import Title from './title/index.svelte'
  import Content from './content/index.svelte'
  import Scenario from './scenario/index.svelte'

  const loadDB = $derived.by(()=>{
    const list = ['encyclopedia', 'character']
    if (store.state.extra){
      if (store.state.extra === 'character'){
        list.push('character_text')
      }else{
        list.push('normal_quest')
        list.push('extra_quest')
      }
    }
    return store.database(...list)
  })

  const item = $derived.by(()=>{
    const id = store.state.item
    if (!id){ return null }
    if (!loadDB.finish){ return null }
    let extraType = store.state.extra
    if (extraType === 'character'){
      const character = loadDB.db['character'][id]
      const characterText = loadDB.db['character_text'][id]
      if (!character){ return null }
      const result = {
        type: 'character',
        releated: [],
        desc: [[characterText[2].split('\n')]],
        title: characterText[0],
        characterID: id,
        storyID: character[8],
      }
      return result
    }else if (extraType){
      const extraQuest = loadDB.db['extra_quest']
      const normalQuest = loadDB.db['normal_quest']
      const result = {
        type: 'story',
        releated: [],
        desc: [],
        title: '',
      }
      let questItem = null
      let storyItem = null
      if (extraType === 'adv-quest'){
        questItem = extraQuest['advent_event_quest'][id]
        storyItem = normalQuest['event/advent_event_quest'][id]
        result.subType = 'event-quest'
      }else if (extraType === 'single-quest'){
        questItem = extraQuest['story_event_single_quest'][id]
        storyItem = normalQuest['event/story_event_single_quest'][id]
        result.subType = 'event-single'
      }
      if (!questItem){ return null }
      result.title = questItem[2]
      result.storyID = id
      result.banner = questItem[4]
      result.eventID = `event_${questItem[0]}`
      if (storyItem){ result.desc = [[storyItem[0].desc.split('\n')]] }
      else{ result.desc = [[result.title.split('\n')]] }
      return result
    }
    const data = loadDB.db.encyclopedia[id]
    return data
  })

  const tab = $derived.by(()=>{
    if (!item){ return stateTab }
    let character = null
    if (item.type === 'character'){ character = loadDB.db.character[item.characterID] }
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
  {:else}
    <Loading finish={loadDB.finish} error={loadDB.error} />
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
