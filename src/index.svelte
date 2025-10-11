<script>
  import './reset.css'
  import { Loading } from './ui'
  import store from './store'
  import List from './list/index.svelte'
  import Dialog from './dialog/index.svelte'
  import Detail from './detail/index.svelte'

  const loadState = store.database('encyclopedia', 'character', 'character_text', 'story_character')

</script>

<div class="main">
  {#if loadState.finish}
    <div class="content">
      <List />
      <Detail />
    </div>
    <Dialog />
  {:else if loadState.error.length > 0}
    <p>Error loading data: {loadState.error.join(', ')}</p>
  {:else}
    <Loading />
  {/if}
</div>

<style>
  .main{
    display: flex;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
  .content{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    margin: 0 auto;
    max-width: 1280px;
    gap: 3px;
  }
</style>
