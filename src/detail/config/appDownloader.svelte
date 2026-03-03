<script>
  import store from '../../store'
  import appLogic from './app.js'

  const target = $derived(store.state.extra.target)
  let closeable = $state((()=>store.state.extra.force ? false : true)())
  let nextable = $state(true)
  let info = $state('')

  let task = { step: 'init' }

  const nextStep = async ()=>{
    if (task.step === 'init'){
      task = { step: 'init' }
      let remote = null
      let localFile = null
      closeable = false
      nextable = false
      info = 'get info from remote'
      try{ remote = await appLogic.getVersionInfo(target) }
      catch(e){
        info = `get remote info fail: ${e}`
        if (store.state.extra.force){ nextable = true }
        else{ closeable = true }
        return
      }
      info = 'get local file'
      try{ localFile = await appLogic.getLocalFile(`cdn/${target}/`) }
      catch(e){
        info = `get local file fail: ${e}`
        if (store.state.extra.force){ nextable = true }
        else{ closeable = true }
        return
      }
      try{
        let result = {}
        for (let file of localFile){
          info = `collect file info: ${file}`
          let hash = await appLogic.calculateCRC32(`cdn/${target}/${file}`)
          result[file] = hash
        }
        let finalTask = appLogic.generateTask(result, remote)
        task = { step: 'start', remove: finalTask.remove, download: finalTask.download }
        info = `prepare task info done, remove: ${task.remove.length}, download: ${task.download.length}`
        if (store.state.extra.force){ closeable = true }
        nextable = true
      }catch(e){
        info = `collect file info fail: ${e}`
        if (store.state.extra.force){ nextable = true }
        else{ closeable = true }
        return
      }
    }else if (task.step === 'start'){
      closeable = false
      nextable = false
      try{ await appLogic.triggerUpdaterFlag(target) }
      catch(e){ console.error(e) }
      for (let file of task.remove){
        info = `remove outdated file: ${file}`
        await appLogic.removeFile(`cdn/${target}/${file}`)
      }
      let downloadFail = []
      for (let file of task.download){
        info = `download file: ${file}`
        try{
          await appLogic.downloadFile(target, file)
        }catch(e){
          console.error(e)
          downloadFail.push(file)
        }
      }
      if (downloadFail.length > 0){
        info = `task finish, fail download: ${downloadFail.length}, click to retry`
        task = { step: 'start', remove: [], download: downloadFail }
        nextable = true
      }else{
        try{ await appLogic.triggerUpdaterFlag() }
        catch(e){ console.error(e) }
        info = `task finish, file update to latest now`
        closeable = true
      }
    }
  }
</script>

<p>hanlde {target}</p>
<p>{info}</p>
{#if nextable}<button class="btn" onclick={nextStep}>next</button>{/if}
{#if closeable}<button class="btn" onclick={()=>store.setAppUpdater(null)}>back</button>{/if}

<style>
  .btn{
    padding: .5em 2em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
</style>
