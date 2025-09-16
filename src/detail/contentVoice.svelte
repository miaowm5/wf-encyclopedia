<script>
  import { Title } from '../ui'
  import MobileBack from './mobileBack.svelte'
  import loadData from './loadVoice.svelte.js'

  const { item, store } = $props()

  const loadState = loadData()
  const data = $derived.by(()=>{
    if (!loadState.finish){ return null }
    if (loadState.error.length > 0){ return null }
    if (!store.state.database.character_speech){ return null }
    const database = store.state.database.character_speech
    const info = database[item[0][5]]
    if (!info){ return null }
    return {
      home: info.filter((item)=>item[0] === '0'),
      join: info.filter((item)=>item[0] === '2')[0],
      evolution: info.filter((item)=>item[0] === '1')[0],
    }
  })
</script>

{#snippet voice(item)}
  <div class="voice">{item[3]}</div>
{/snippet}

<div class="content">
  {#if !loadState.finish}
    {#if loadState.error.length > 0}
      <p>{loadState.error[0]}</p>
    {:else}
      <p>loading...</p>
    {/if}
  {:else if data}
    <Title>加入/觉醒</Title>
    {@render voice(data.join)}
    {@render voice(data.evolution)}
    <Title>主界面</Title>
    {#each data.home as item}
      {@render voice(item)}
    {/each}
    <!-- <Title>其他</Title> -->
  {/if}
  <MobileBack />
</div>

<style>
  .content{
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
  }
  .voice{
    margin-bottom: 1em;
  }
</style>
