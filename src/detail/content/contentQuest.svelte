<script>
  import store from '../../store'
  import { Loading } from '../../ui'
  import MobileBack from './mobileBack.svelte'
  import loadData from './loadQuest.svelte.js'
  import loadScenario from './loadQuestScenario.svelte'

  const { item } = $props()

  let selectScenario = $state(null)
  const loadState = loadData()
  const data = $derived.by(()=>{
    if (!loadState.finish){ return null }
    if (loadState.error.length > 0){ return null }
    if (!store.state.database.character_quest){ return null }
    const database = store.state.database.character_quest
    return database[item[0][5]]
  })
  const scenario = $derived.by(()=>{ return loadScenario(item[0][6]) })
  const scenarioData = $derived.by(()=>{
    if (!selectScenario){ return null }
    return scenario.get(selectScenario)
  })

  const database = store.state.database.story_character
  const getCharacteName = (character)=>{
    if (!database[character]){ return character }
    return database[character][0]
  }
  const getCharacteColor = (character)=>{
    if (!database[character]){ return '#7c8574' }
    return `#${database[character][1].slice(2)}`
  }
</script>

{#key selectScenario || ''}
<div class="content">
  {#if !loadState.finish}
    {#if loadState.error.length > 0}
      <p>{loadState.error[0]}</p>
    {:else}
      <Loading />
    {/if}
  {:else if selectScenario}
    <button class="scenarioBack" onclick={()=>{ selectScenario = null }}>
      {store.i18n("detail.content.storyBack")}
    </button>
    {#if scenarioData}
      {#each scenarioData as item}
        {#if item.command === "dialog"}
          <div class="dialog">
            <div class="dialogName" style:background-color={getCharacteColor(item.param[0])}>
              {getCharacteName(item.param[0])}
            </div>
            <div class="dialogContent">
              {#each item.param[1].split('\\n') as lines}
                {#each lines.split('\n') as line}
                  <p>{line}</p>
                {/each}
              {/each}
            </div>
          </div>
        {:else}
          <!-- <div style:word-break="break-all">{JSON.stringify(item)}</div> -->
        {/if}
      {/each}
      <button class="scenarioBack last" onclick={()=>{ selectScenario = null }}>
        {store.i18n("detail.content.storyBack")}
      </button>
    {:else}
      <Loading />
    {/if}
  {:else if data}
    {#each data as story}
      <button class="story" onclick={()=>{ selectScenario = story.path }}>
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
{/key}

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
  .scenarioBack{
    display: inline-block;
    border: none;
    background: white;
    margin-bottom: 1em;
    text-align: left;
    padding: 1em 1em;
    border-radius: .3em;
    box-shadow: none;
    width: 100%;
    font-size: .9em;
  }
  .scenarioBack.last{
    margin-top: 2em;
  }
  .dialog{
    margin: .5em 0 1em;
    overflow: hidden;
    background: #fafafa;
    border-top: 1px solid white;
    border-radius: 10px;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
  }
  .dialog>.dialogName{
    color: white;
    padding: .2em .5em;
    font-size: .9em;
    max-width: 11em;
    margin-top: .8em;
    position: relative;
  }
  .dialog>.dialogName::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 1em solid transparent;
    border-bottom: 1em solid transparent;
    border-right: 7px solid #fafafa;
  }
  .dialog>.dialogContent{
    padding: .8em 1em 1em;
  }
</style>
