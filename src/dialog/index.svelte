<script>
  import store from '../store'
  import { OnBack } from '../common'
  import { MagicCircle } from '../ui'
  import FilterCharacter from './filterCharacter.svelte'
  import AppAssetsCheck from './appAssetsCheck.svelte'

  const closeDialog = ()=>{
    store.setDialog(null)
  }

</script>

{#if store.state.dialog.type}
  <div class="main"><div class="dialog">
    {#if store.state.dialog.type === 'filterCharacter'}
      <FilterCharacter />
    {/if}
    {#if import.meta.env.VITE_APPMODE === 'app' && store.state.dialog.type === 'appAssetsCheck'}
      <AppAssetsCheck />
    {/if}
    <MagicCircle dialog={true} />
  </div></div>
  {#if store.state.dialog.closeable}
    <OnBack route={store.route} func={closeDialog} />
  {/if}
{/if}

<style>
  .main{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255,255,255,.5);
    z-index: 100;
  }
  .dialog{
    width: 90%;
    max-width: 600px;
    max-height: 80%;
    background: linear-gradient(to top, #eff0f2 0, #fafafa 2em, #fafafa 100%);
    border: 2px solid white;
    border-radius: 1em;
    box-shadow: 0 0 8px rgba(0,0,0,.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 1em;
    z-index: 0;
    position: relative;
  }
</style>
