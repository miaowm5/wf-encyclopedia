<script>
  import store from '../store'
  import { wrapApi } from '../common'
  import Frame from './frame.svelte'
  import Button from './button.svelte'
  import appLogic from './app.js'

  let nextable = $state(false)
  let cancelable = $state(true)
  let retry = $state(false)
  let status = $state(100)
  let info = $state('')
  let task = $state({})

  let cancel = false
  let localVersion = ''
  $effect(()=>{ return ()=>{ cancel = true } })

  const getVersion = wrapApi('/app/manifest.json',{
    before: ()=>{
      info = ''
      status = 100
      nextable = false
      retry = false
    },
    success: (data)=>{
      localVersion = data.version
      getRemoteVersion()
    },
    fail: (e)=>{
      console.error(e)
      status = 101
      info = e.message || e
      retry = true
    },
    cors: true,
  })
  const getRemoteVersion = async ()=>{
    info = ''
    status = 200
    nextable = false
    retry = false
    try{
      const manifest = await appLogic.getVersion()
      if (cancel){ return }
      status = manifest.version != localVersion ? 300 : 400
      nextable = true
    }catch(e){
      console.error(e)
      status = 201
      info = e.message || e
      retry = true
    }
  }
  const updateSelf = async ()=>{
    info = ''
    status = 301
    nextable = false
    retry = false
    try{
      await appLogic.downloadVersion()
    }catch(e){
      console.error(e)
      status = 302
      info = e.message || e
      retry = true
    }
  }
  const retryButton = ()=>{
    if (status === 101){ getVersion.execute() }
    if (status === 201){ getRemoteVersion() }
    if (status === 302){ updateSelf() }
  }
  const okButton = ()=>{
    if (status === 300){
      cancelable = false
      store.setDialog('appSelfCheck', null, false)
      updateSelf()
    }
    if (status === 400){ store.setDialog(null) }
  }
  const cancelButton = ()=>{ store.setDialog(null) }

  getVersion.execute()

</script>

<Frame>
  {#snippet header()}
    {store.i18n("dialog.app.title1", [''])}
  {/snippet}
  {#snippet content()}
  <div class="content">
    {#if status === 100}
      <p>{store.i18n("dialog.app.text2")}</p>
    {:else if status === 101}
      <p>{store.i18n("dialog.app.text4")}</p>
      <p class="info">{info}</p>
    {:else if status === 200}
      <p>{store.i18n("dialog.app.text1")}</p>
    {:else if status === 201}
      <p>{store.i18n("dialog.app.text3")}</p>
      <p class="info">{info}</p>
    {:else if status === 300}
      <p>{store.i18n("dialog.app.text10")}</p>
    {:else if status === 301}
      <p>{store.i18n("dialog.app.text11")}</p>
    {:else if status === 302}
      <p>{store.i18n("dialog.app.text3")}</p>
      <p class="info">{info}</p>
    {:else if status === 400}
      <p>{store.i18n("dialog.app.text9")}</p>
    {/if}
  </div>
  {/snippet}
  {#snippet submit()}
    {#if cancelable}
      <Button type="cancel" onclick={cancelButton}>{store.i18n("dialog.app.button2")}</Button>
    {/if}
    {#if retry}
      <Button type="ok" onclick={retryButton}>{store.i18n("dialog.app.button3")}</Button>
    {:else}
      <Button type="ok" onclick={okButton} disabled={!nextable}>{store.i18n("dialog.app.button1")}</Button>
    {/if}
  {/snippet}
</Frame>

<style>
  .content{
    margin-top: .5em;
    min-height: 6em;
  }
  .content .info{
    word-break: break-all;
  }
</style>
