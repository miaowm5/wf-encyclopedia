<script>
  import store from '../store'
  import { OnBack, cdn } from '../common'
  import FilterCharacter from './filterCharacter.svelte'

  const closeDialog = ()=>{
    store.setDialog(null)
  }

</script>

{#if store.state.dialog.type}
  <div class="main"><div class="dialog" style:--magic-circle={`url('${cdn('cdn', 'ui/circle.png')}')`}>
    <div>
      {#if store.state.dialog.type === 'filterCharacter'}
        <FilterCharacter />
      {/if}
    </div>
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
    --magic-circle-pos: 70%;
  }
  .dialog>div{
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  .dialog::after {
    z-index: -1;
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, var(--magic-circle-pos));
    width: 70%;
    height: 70%;
    background: var(--magic-circle) no-repeat center/contain;
    animation: rotate-magic 25s linear infinite;
    pointer-events: none;
    opacity: 0.7;
  }
  @keyframes rotate-magic {
    from { transform: translate(-50%, var(--magic-circle-pos)) rotate(0deg); }
    to { transform: translate(-50%, var(--magic-circle-pos)) rotate(360deg); }
  }
  @media (max-width: 550px){ .dialog { --magic-circle-pos: 65%; } }
  @media (max-width: 450px){ .dialog { --magic-circle-pos: 60%; } }
  @media (max-width: 350px){ .dialog { --magic-circle-pos: 55%; } }
</style>
