<script>
  import store from '../store'
  import { OnBack } from '../common'
  import FilterCharacter from './filterCharacter.svelte'

  const closeDialog = ()=>{
    store.setDialog(null)
  }

</script>

{#if store.dialog.type}
  <div class="main"><div class="dialog">
    {#if store.dialog.type === 'filterCharacter'}
      <FilterCharacter />
    {/if}
  </div></div>
  {#if store.dialog.closeable}
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
    background-color: #fafafa;
    border: 2px solid white;
    border-radius: 1em;
    box-shadow: 0 0 8px rgba(0,0,0,.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 1em;
  }
</style>
