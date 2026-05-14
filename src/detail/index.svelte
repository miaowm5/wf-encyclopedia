<script>
  import store from '../store'
  import { cdn } from '../common'
  import { Loading } from '../ui'
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
    <span class={[store.state.ui.page !== 'item' && 'hide', 'body']} style:--magic-circle={`url('${cdn('cdn', 'ui/circle.png')}')`}>
      <span>
        <Loading finish={loadDB.finish} error={loadDB.error}>
          {#if item}
            <Title item={item} itemType={item.type} tab={tab === 'voice-none' ? 'voice' : tab} extra={store.state.extra} />
            <Content item={item} itemType={item.type} tab={tab} extra={store.state.extra} />
          {/if}
        </Loading>
      </span>
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
    --magic-circle-pos: 50%;
  }
  .body>span{
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
  }
  .body::after {
    z-index: -1;
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, var(--magic-circle-pos));
    width: 90%;
    aspect-ratio: 1 / 1;
    height: auto;
    background: var(--magic-circle) no-repeat center/contain;
    animation: rotate-magic 25s linear infinite;
    pointer-events: none;
  }
  @keyframes rotate-magic {
    from { transform: translate(-50%, var(--magic-circle-pos)) rotate(0deg); }
    to { transform: translate(-50%, var(--magic-circle-pos)) rotate(360deg); }
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
