<script>
  import { cdn } from '../../common'
  import store from '../../store'
  import { MagicCircle } from '../../ui'
  import appLogic from './app.js'

  let task = $derived(store.state.extra)
  let status = $state(1)
  let info = $state('')
  let progress = $state(1)
  let progressValue = $derived((Math.min(100, (progress / (task.download.length || 1)) * 100)).toFixed(2))

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

  const anime = (canvas)=>{
    let cancel = false
    const ctx = canvas.getContext('2d')
    let offsetX = 0
    const speed = 1.3
    let loadedCount = 0
    function onImageLoad() {
      if (cancel){ return }
      loadedCount++
      if (loadedCount === 2) {
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        requestAnimationFrame(animate)
      }
    }
    const arrowImg = new Image()
    arrowImg.src = '/assets/updater/belt.png'
    const boxImg = new Image()
    boxImg.src = '/assets/updater/box.png'
    arrowImg.onload = onImageLoad
    boxImg.onload = onImageLoad
    function resizeCanvas() {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    function animate(){
      if (cancel){ return }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const canvasH = canvas.height
      const arrowScale = canvasH / arrowImg.height
      const arrowW = arrowImg.width * arrowScale
      const boxH = canvasH * 0.55
      const boxScale = boxH / boxImg.height;
      const boxW = boxImg.width * boxScale;
      const boxY = (canvasH - boxH) / 2
      const patternW = arrowW * 2
      offsetX += speed;
      const startX = -(offsetX % patternW)
      for (let x = startX; x < canvas.width + patternW; x += patternW) {
        ctx.drawImage(arrowImg, x, 0, arrowW, canvasH)
        ctx.drawImage(arrowImg, x + arrowW, 0, arrowW, canvasH)
        ctx.drawImage(boxImg, x + (arrowW - boxW) / 2, boxY, boxW, boxH)
      }
      requestAnimationFrame(animate)
    }
    return ()=>{
      cancel = true
      window.removeEventListener('resize', resizeCanvas)
    }
  }

</script>

<div class="body" style:background-image={`url(${cdn('cdn', 'ui/back.jpg')})`}><div class="main">
  <div class="conveyor">
    <div class="conveyor-belt"><canvas {@attach anime}></canvas></div>
  </div>
  <div class="info">
    <div class="title">
      {#if status === 1}
        <h2>{store.i18n("detail.config.appText1")}</h2>
      {:else if status === 2}
        <h2>{store.i18n("detail.config.appText2")}</h2>
      {/if}
      <h2>{progressValue}%</h2>
    </div>

    <div class="progress"><div style:width={`${progressValue}%`}></div></div>

    <div class="message">
      <p>{info}</p>
      {#if status === 2 && task.download.length > 50}
        <p>{store.i18n("detail.config.appText3")}</p>
        <button class="btn" onclick={()=>Neutralino.os.open('https://worldflipper.miaowm5.com/app/driver')}>
          {store.i18n("detail.config.appText4")}
        </button>
      {/if}
    </div>
  </div>
  <MagicCircle />
</div></div>

<style>
  .body{
    width: 100%;
    height: 100%;
    background: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .main{
    width: 100%;
    height: 99%;
    max-width: 500px;
    border: 5px solid #dad8db;
    z-index: 0;
    position: relative;
    overflow: hidden;
    background: linear-gradient(#eee9e6, #eee9e6 10%, #eaeaea 60%, #eaeaea);
    display: flex;
    flex-direction: column;
  }
  .conveyor{
    flex: 65;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .info{
    flex: 35;
    text-align: center;
  }
  .conveyor-belt {
    width: 100%;
    height: 20%;
    max-height: 5em;
  }
  .conveyor-belt canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
  .progress{
    background-color: #515151;
    width: 90%;
    margin: .7em auto;
    position: relative;
    height: .5em;
  }
  .progress>div{
    background-color: #fd9c1d;
    height: 100%;
    transition: width 1s;
  }
  .info>.title{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.3em;
    gap: 1em;
  }
  .btn{
    padding: .5em 2em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
  .message>*{
    margin-bottom: .5em;
  }
</style>
