<script>
  import store from '../../store'
  import appLogic from './app.js'

  let task = $state((()=>store.state.extra.target)())
  let info = $state('')

  const nextStep = async ()=>{
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
      task = { remove: [], download: downloadFail }
    }else{
      try{ await appLogic.triggerUpdaterFlag() }
      catch(e){ console.error(e) }
      info = `task finish, file update to latest now`
    }
  }
</script>

<p>{info}</p>

{#snippet belt()}
  <!-- svelte-ignore a11y_missing_attribute -->
  <img src="/assets/updater/belt.png" class="item" />
{/snippet}
{#snippet box()}
  <!-- svelte-ignore a11y_missing_attribute -->
  <img src="/assets/updater/box.png" class="item" />
{/snippet}
<div class="conveyor-belt">
  <div class="track">
    <div class="belt">
      {@render belt()}{@render belt()}{@render belt()}{@render belt()}{@render belt()}
      {@render belt()}{@render belt()}{@render belt()}{@render belt()}{@render belt()}
    </div>
    <div class="box">
      {@render box()}{@render box()}{@render box()}{@render box()}{@render box()}
      {@render box()}{@render box()}{@render box()}{@render box()}{@render box()}
    </div>
  </div>
</div>

<style>
  .btn{
    padding: .5em 2em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
  .conveyor-belt {
    width: 100%;
    overflow: hidden;
    background: #333;
    padding: 20px 0;
    border-bottom: 5px solid #555;
  }
  .track {
    display: flex;
    width: max-content;
    animation: move-left 10s linear infinite;
  }
  .item {
    width: 150px;
    height: 80px;
    margin: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  @keyframes move-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
</style>
