<script>
  import store from '../../store'
  import { Title } from '../../ui'
  import Desc from './common/desc.svelte'
  import Button from './common/button.svelte'
  import appLogic from './app.js'

  const info = appLogic.getCDNInfo()
</script>

{#snippet appCDNInfo(name, offline)}
  <div class="info">
    <Desc text={
      store.i18n(offline ? "detail.config.appText6" : "detail.config.appText5", [name])
    } />
    <Button
      text={store.i18n(offline ? "detail.config.appText8" : "detail.config.appText7")}
      onclick={()=>store.setDialog('appAssetsCheck', { target: name, force: false }, true)}
    />
  </div>
{/snippet}

<Title>{store.i18n("detail.config.appTitle1")}</Title>
<Button text={store.i18n("detail.config.appText9")} onclick={()=>store.setDialog('appSelfCheck', null, true)} />
<Title>{store.i18n("detail.config.appTitle2")}</Title>
<Desc text={store.i18n("detail.config.appText10")} />
{#each info.list as item, index}{@render appCDNInfo(item, info.useable[index])}{/each}

<style>
  .info{
    margin-top: 1em;
  }
</style>
