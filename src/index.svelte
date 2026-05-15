<script>
  import './reset.css'
  import store from './store'
  import List from './list/index.svelte'
  import Dialog from './dialog/index.svelte'
  import Detail from './detail/index.svelte'
  import AppDownloader from './detail/config/appDownloader.svelte'
</script>

<div class="main">
  {#if import.meta.env.VITE_APPMODE === 'app' && store.state.ui.page === 'appUpdater'}
    <AppDownloader />
  {:else}
    <div class="content">
      <List />
      <Detail />
    </div>
  {/if}
  <Dialog />
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
