<script>
  import { Title } from '../ui'
  import MobileBack from './mobileBack.svelte'
  import loadData from './loadVoice.svelte.js'

  const { item, store } = $props()

  const loadState = loadData()
  const database = store.state.database.character_speech

</script>

<div class="content">
  {#if !loadState.finish}
    {#if !loadState.error.length > 0}
      <p>{loadState.error[0]}</p>
    {:else}
      <p>loading...</p>
    {/if}
  {:else}
    <Title>加入/觉醒</Title>
    <Title>主界面</Title>
    <Title>其他</Title>
  {/if}
  <MobileBack />
</div>

<style>
  .content{
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
  }
</style>
