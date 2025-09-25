<script>
  import store from '../../store'
  import MobileBack from './mobileBack.svelte'
  import loadData from './loadQuest.svelte.js'

  const { item } = $props()

  const loadState = loadData()
  const data = $derived.by(()=>{
    if (!loadState.finish){ return null }
    if (loadState.error.length > 0){ return null }
    if (!store.state.database.character_quest){ return null }
    const database = store.state.database.character_quest
    return database[item[0][5]]
  })

</script>

<div class="content">
  {#if !loadState.finish}
    {#if loadState.error.length > 0}
      <p>{loadState.error[0]}</p>
    {:else}
      <p>loading...</p>
    {/if}
  {:else if data}
    {#each data as story}
      <button class="story" onclick={()=>{ console.log(story.path) }}>
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
