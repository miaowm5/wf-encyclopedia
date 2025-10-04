<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  import { Loading } from '../../ui'
  import loadScenario from './loadScenario.svelte'

  const { scenario } = $props()

  const scenarioData = $derived.by(()=>{
    return loadScenario(scenario.path)
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
  const backSprite = spriteSheet('res/icon', 'return')
</script>

<div class="content">
<button class="scenarioBack" onclick={()=>{ store.setScenario(null) }}>
  <img src={backSprite.src} alt={store.i18n("detail.content.storyBack")}>
  {store.i18n("detail.content.storyBack")}
</button>
{#if scenarioData.data}
<div class="list">
  {#each scenarioData.data as item}
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
</div>
{:else}
  <Loading />
{/if}
</div>

<style>
  .content{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .scenarioBack{
    display: inline-block;
    border: none;
    border-bottom: 1px solid #eaeaea;
    background: white;
    text-align: left;
    padding: .8em .8em .5em;
    box-shadow: none;
    font-size: .9em;
    position: relative;
    line-height: 1.5em;
  }
  .scenarioBack :global img{
    height: 1.5em;
    margin-bottom: -.4em;
  }
  .list{
    flex: 1;
    overflow: auto;
    padding: 1em 1em 5em;
  }
  .dialog{
    margin: .5em 0 1em;
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
