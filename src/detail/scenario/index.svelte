<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  import { Loading } from '../../ui'
  import loadScenario from './loadScenario.svelte'
  import Name from './dialogName.svelte'

  const { scenario } = $props()

  const scenarioData = $derived.by(()=>{
    return loadScenario(scenario.path)
  })

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
      <div class={[item.param[4] === '1' && 'leftDialog', item.param[4] === '3' && 'rightDialog']}>
        <div class="dialog">
          <Name character={item.param[0]} />
          <div class="dialogContent">
            {#each item.param[1].split('\\n') as lines}
              {#each lines.split('\n') as line}
                <p>{line}</p>
              {/each}
            {/each}
          </div>
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
  .dialog>.dialogContent{
    padding: .8em 1em 1em;
  }
  .leftDialog{ padding-right: 4%; }
  .rightDialog{ padding-left: 4%; }
</style>
