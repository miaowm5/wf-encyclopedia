<script>
  import store from '../../store'
  import { Loading } from '../../ui'
  import MobileBack from './mobileBack.svelte'

  const { item, itemType } = $props()

  const loadDB = $derived.by(()=>{
    return store.database(itemType === 'story' ? 'normal_quest' : 'character_quest')
  })

  const data = $derived.by(()=>{
    if (!loadDB.finish){ return null }
    if (loadDB.error.length > 0){ return null }
    if (itemType === 'story'){
      if (!loadDB.db['normal_quest']){ return null }
      const database = loadDB.db['normal_quest']
      let storyType = item.subType
      if (storyType === 'main'){
        return database.main_quest[item.storyID]
      }else if (storyType === 'event-world'){
        return database['event/world_story_event_quest'][item.storyID]
      }else if (storyType === 'event-single'){
        return database['event/story_event_single_quest'][item.storyID]
      }else if (storyType === 'event-quest'){
        return database['event/advent_event_quest'][item.storyID]
      }else if (storyType === 'prologue'){
        return database.main_quest[0]
      }
      return null
    }else{
      if (!loadDB.db['character_quest']){ return null }
      const database = loadDB.db['character_quest']
      return database[item.characterID]
    }
  })
</script>

<div class="content">
  <Loading finish={loadDB.finish} error={loadDB.error} />
  {#if loadDB.finish && data}
    {#each data as story}
      <button class="story" onclick={()=>{
        store.setScenario({
          title: story.title,
          path: story.path,
          desc: story.desc
        })
      }}>
        <p>{story.title}</p>
        <div class="comment">
          {#each story.desc.split('\n') as line}
            <p>{line}</p>
          {/each}
        </div>
      </button>
    {/each}
  {/if}
  <MobileBack />
</div>

<style>
  .content{
    flex: 1;
    padding: 1em 1em 6em 1em;
    overflow: auto;
  }
  .story{
    display: inline-block;
    border: none;
    background: white;
    margin-bottom: 1em;
    text-align: left;
    padding: 1em 1em;
    border-radius: .3em;
    box-shadow: none;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .story>.comment{
    color: #888;
    font-size: .9em;
    margin-top: .3em;
  }
</style>
