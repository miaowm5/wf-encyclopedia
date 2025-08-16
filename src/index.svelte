<script>
  import './reset.css'
  import loadData from './loadData.svelte.js'
  import List from './list/index.svelte'

  const loadState = loadData()

</script>

<div class="main">
  {#if loadState.finish}
    <List />
  {:else if loadState.error.length > 0}
    <p>Error loading data: {loadState.error.join(', ')}</p>
  {:else}
    <p>Loading...</p>
  {/if}
</div>

<style>
  .main{
    display: flex;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
</style>
