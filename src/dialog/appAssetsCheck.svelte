<script>
  import store from '../store'
  import { cdn, wrapApi } from '../common'
  import Frame from './frame.svelte'
  import Button from './button.svelte'
  import appLogic from './app.js'

  const dialogData = $derived(store.state.dialog.data)

  let nextable = $state(false)
  let retry = $state(false)
  let status = $state(1)
  let info = $state('')
  let task = $state({})

  let cancel = false
  $effect(()=>{ return ()=>{ cancel = true } })

  const getVersion = wrapApi('version.json',{
    before: ()=>{
      info = ''
      status = 100
      nextable = false
      retry = false
      return { url: cdn(dialogData.target, 'version.json', true) }
    },
    success: (data)=>{ task.remote = data; getLocalFile() },
    fail: (e)=>{
      console.error(e)
      status = 101
      info = e.message || e
      retry = true
    }
  })
  const getLocalFile = async ()=>{
    info = ''
    status = 200
    nextable = false
    retry = false
    try{
      let localFile = await appLogic.getLocalFile(`cdn/${dialogData.target}/`)
      if (cancel){ return }
      let result = {}
      for (let file of localFile){
        if (cancel){ return }
        info = file
        result[file] = await appLogic.calculateCRC32(`cdn/${dialogData.target}/${file}`)
      }
      if (cancel){ return }
      let finalTask = appLogic.generateTask(result, task.remote)
      task.remove = finalTask.remove
      task.download = finalTask.download
      status = 300
      nextable = true
    }catch(e){
      console.error(e)
      if (!cancel){
        status = 201
        info = e.message || e
        retry = true
      }
      return
    }
  }
  const retryButton = ()=>{
    if (status === 101){ getVersion.execute() }
    if (status === 201){ getLocalFile() }
  }
  const okButton = ()=>{
    if (status === 1){ getVersion.execute() }
    if (status === 300){
      task.target = dialogData.target
      let data = JSON.parse(JSON.stringify(task))
      appLogic.triggerUpdaterFlag(dialogData.target).then(()=>{
        store.setAppUpdater(data)
      }).catch((e)=>{
        console.error(e)
        if (cancel){ return }
        info = e.message || e
        retry = true
        status = 201
      })
    }
  }
  const cancelButton = ()=>{ store.setDialog(null) }
  (()=>{ if (!dialogData.force){ getVersion.execute() } })()
</script>

<Frame>
  {#snippet header()}
    {store.i18n("dialog.app.title1", [dialogData.target])}
  {/snippet}
  {#snippet content()}
    {#if status === 1}
      <p>{store.i18n("dialog.app.text5", [dialogData.target])}</p>
    {:else if status === 100}
      <p>{store.i18n("dialog.app.text1")}</p>
    {:else if status === 101}
      <p>{store.i18n("dialog.app.text3")}</p>
      <p>{info}</p>
    {:else if status === 200}
      <p>{store.i18n("dialog.app.text2")}</p>
      <p>{info}</p>
    {:else if status === 201}
      <p>{store.i18n("dialog.app.text4")}</p>
      <p>{info}</p>
    {:else if status === 300}
      <p>{store.i18n("dialog.app.text6", [task.remove.length, task.download.length])}</p>
    {/if}
  {/snippet}
  {#snippet submit()}
    {#if !dialogData.force}
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
</style>
