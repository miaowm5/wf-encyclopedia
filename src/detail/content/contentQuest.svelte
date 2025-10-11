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
      let storyType = item[0][4]
      if (storyType === '3'){
        return database.main_quest[item[0][12]]
      }else if (storyType === '4'){
        let storyType2 = item[0][13]
        if (storyType2 === '6'){
          return database['event/world_story_event_quest'][item[0][14]]
        }else if (storyType2 === '2'){
          return database['event/story_event_single_quest'][item[0][14]]
        }else if (storyType2 === '0'){
          return database['event/advent_event_quest'][item[0][14]]
        }
      }else if (storyType === '5'){
        return database.main_quest[0]
      }
      return null
    }else{
      if (!loadDB.db['character_quest']){ return null }
      const database = loadDB.db['character_quest']
      return database[item[0][5]]
    }
  })
</script>

<div class="content">
  {#if !loadDB.finish}
    {#if loadDB.error.length > 0}
      <p>{loadDB.error[0]}</p>
    {:else}
      <Loading />
    {/if}
  {:else if data}
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
