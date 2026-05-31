<script>
  import store from '../../store'
  import { Title } from '../../ui'
  import appLogic from './app.js'

  const info = appLogic.getCDNInfo()
</script>

{#snippet appCDNInfo(name, offline)}
  <div>
    {#if offline}
      <p>{store.i18n("detail.config.appText6", [name])}</p>
    {:else}
      <p>{store.i18n("detail.config.appText5", [name])}</p>
    {/if}
    <button class="btn"
      onclick={()=>store.setDialog('appAssetsCheck', { target: name, force: false }, true)}
    >
      {#if offline}
        {store.i18n("detail.config.appText8")}
      {:else}
        {store.i18n("detail.config.appText7")}
      {/if}
    </button>
  </div>
{/snippet}

<Title>{store.i18n("detail.config.appTitle1")}</Title>
<button class="btn" onclick={()=>store.setDialog('appSelfCheck', null, true)}>
  {store.i18n("detail.config.appText9")}
</button>
<Title>{store.i18n("detail.config.appTitle2")}</Title>
<div class="desc">{#each store.i18n("detail.config.appText10").split('\n') as line}
  <p>{line}</p>
{/each}</div>
{#each info.list as item, index}{@render appCDNInfo(item, info.useable[index])}{/each}

<style>
  .btn{
    padding: .5em 2em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
</style>
