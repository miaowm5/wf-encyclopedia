<script>
  import store from '../store'
  import Frame from './frame.svelte'
  import Button from './button.svelte'
  import appLogic from './app.js'

  const dialogData = $derived(store.state.dialog.data)
  let retry = $derived(dialogData.download.length > 0)

  const retryButton = ()=>{
    store.setAppUpdater(JSON.parse(JSON.stringify(dialogData)))
  }
  const okButton = ()=>{
    appLogic.triggerUpdaterFlag(null).catch((e)=>{ console.error(e) })
    store.setAppUpdater(null)
  }
</script>

<Frame>
  {#snippet header()}
    {store.i18n("dialog.app.title1", [dialogData.target])}
  {/snippet}
  {#snippet content()}
    {#if retry}
      <p>{store.i18n("dialog.app.text8", [dialogData.download.length])}</p>
    {:else}
      <p>{store.i18n("dialog.app.text7")}</p>
    {/if}
  {/snippet}
  {#snippet submit()}
    {#if retry}
      <Button type="ok" onclick={retryButton}>{store.i18n("dialog.app.button3")}</Button>
    {:else}
      <Button type="ok" onclick={okButton}>{store.i18n("dialog.app.button4")}</Button>
    {/if}
  {/snippet}
</Frame>

<style>
</style>
