<script>
  import './reset.css'
  import loadData from './loadData.svelte.js'
  import List from './list/index.svelte'
  import Detail from './detail/index.svelte'

  const loadState = loadData()

</script>

<div class="main">
  {#if loadState.finish}
    <div class="content">
      <List />
      <Detail />
    </div>
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
  .content{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    margin: 0 auto;
    max-width: 1280px;
    gap: .5em;
  }
</style>
