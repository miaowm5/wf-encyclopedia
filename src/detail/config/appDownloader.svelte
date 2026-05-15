<script>
  import store from '../../store'
  import appLogic from './app.js'

  let task = $derived(store.state.extra)
  let status = $state(1)
  let info = $state('')
  let progress = $state(0)

  const update = async ()=>{
    status = 1
    info = ''
    for (let file of task.remove){
      info = file
      await appLogic.removeFile(`cdn/${task.target}/${file}`)
    }
    status = 2
    let downloadFail = []
    progress = 0
    for (let file of task.download){
      info = file
      try{
        await appLogic.downloadFile(task.target, file)
      }catch(e){
        console.error(e)
        downloadFail.push(file)
      }
      progress += 1
    }
    status = 3
    info = ''
    store.setDialog('appAssetsResult', { target: task.target, remove: [], download: downloadFail } ,false)
  }

  $effect(()=>{
    if (task){ update() }
  })
</script>

<div>
  progress: {(Math.min(100, (progress / (task.download.length || 1)) * 100)).toFixed(2)}%
</div>

{#if status === 1}
  <h2>{store.i18n("detail.config.appText1")}</h2>
  <p>{info}</p>
{:else if status === 2}
  <h2>{store.i18n("detail.config.appText2")}</h2>
  <p>{info}</p>
  {#if task.download.length > 50}
    <p>{store.i18n("detail.config.appText3")}</p>
    <button class="btn" onclick={()=>Neutralino.os.open('https://worldflipper.miaowm5.com/app/driver')}>
      {store.i18n("detail.config.appText4")}
    </button>
  {/if}
{/if}

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
