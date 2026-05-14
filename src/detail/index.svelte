<script>
  import store from '../store'
  import { cdn } from '../common'
  import { Loading, MagicCircle } from '../ui'
  import Title from './title/index.svelte'
  import Content from './content/index.svelte'
  import Scenario from './scenario/index.svelte'
  import Config from './config/index.svelte'
  import Music from './music/index.svelte'
  import logicFunc from './logic.svelte.js'

  const logic = logicFunc()
  const loadDB = $derived(logic.loadDB)
  const item = $derived(logic.item)
  const tab = $derived(logic.tab)

</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  {#if store.state.ui.page === 'scenario'}
    {#if store.state.scenario}<Scenario scenario={store.state.scenario} />{/if}
  {:else if store.state.ui.page === 'config'}
    <Config />
  {:else if store.state.ui.page === 'music'}
    <Music />
  {/if}
  {#if store.state.item}{#key store.state.item}
    <span class={[store.state.ui.page !== 'item' && 'hide', 'body']}>
      <Loading finish={loadDB.finish} error={loadDB.error}>
        {#if item}
          <Title item={item} itemType={item.type} tab={tab === 'voice-none' ? 'voice' : tab} extra={store.state.extra} />
          <Content item={item} itemType={item.type} tab={tab} extra={store.state.extra} />
        {/if}
      </Loading>
      <MagicCircle />
    </span>
  {/key}{/if}
</div>

<style>
  .main{
    flex: 3;
    position: relative;
  }
  .body{
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 0;
  }
  .hide{
    display: none;
  }
  @media (max-width: 800px) {
    .mobileHide{
      display: none;
    }
  }
</style>
