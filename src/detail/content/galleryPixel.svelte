<script>
  import store from '../../store'
  import { Title, RoundButton } from '../../ui'
  import loadPixel from './loadPixel.svelte'

  const { emotionList } = $props()

  const pixel = $derived.by(()=>{
    if (!emotionList.id){ return null }
    return loadPixel(emotionList.id)
  })

</script>

<Title>{store.i18n("detail.content.title10")}</Title>
<div class="image"
  style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/party_thumbnail_tile_bg_old.png'})`}
>
  {#if pixel && pixel.src}
    <div class="wrapper" style:height={`${pixel.config.height * pixel.scaleRate + 40}px`}>
      <img src={pixel.src} alt="pixel" />
    </div>
    <div class="speed">
      <RoundButton title={store.i18n("detail.content.galleyPixel3")} onclick={()=>pixel.speed(20)} active={pixel.speedRate === 20} />
      <RoundButton title={store.i18n("detail.content.galleyPixel4")} onclick={()=>pixel.speed(10)} active={pixel.speedRate === 10} />
      <RoundButton title={store.i18n("detail.content.galleyPixel5")} onclick={()=>pixel.speed(35)} active={pixel.speedRate === 35} />
    </div>
    <div class="scale">
      <RoundButton title={store.i18n("detail.content.galleyPixel1")} onclick={()=>pixel.scale(2)} active={pixel.scaleRate === 2} />
      <RoundButton title={store.i18n("detail.content.galleyPixel2")} onclick={()=>pixel.scale(4)} active={pixel.scaleRate === 4} />
    </div>
  {/if}
</div>
<div class="frameBtnGroup">
  <button class="frameBtn" onclick={()=>{ pixel.changeFrame(-1) }}>{store.i18n("detail.content.galleyPixel9")}</button>
  <div>
    {#if pixel.playing}
      <button class="frameBtn" onclick={()=>{ pixel.pause() }}>{store.i18n("detail.content.galleyPixel7")}</button>
    {:else}
      <button class="frameBtn" onclick={()=>{ pixel.play() }}>{store.i18n("detail.content.galleyPixel6")}</button>
    {/if}
  </div>
  <button class="frameBtn" onclick={()=>{ pixel.changeFrame(1) }}>{store.i18n("detail.content.galleyPixel8")}</button>
</div>

<style>
  .image{
    padding: 20px 0;
    width: 100%;
    text-align: center;
    background-color: #232223;
    position: relative;
    min-height: 128px;
  }
  .wrapper{
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .wrapper img{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .scale, .speed{
    position: absolute;
    left: .5em;
    display: flex;
  }
  .scale{ top: 4em }
  .speed{ top: 1em }
  .frameBtnGroup{
    display: flex;
    width: 100%;
    margin-top: .5em;
  }
  .frameBtnGroup>div{
    flex: 1;
    text-align: center;
  }
  .frameBtn{
    padding: .3em 1.5em;
    border-top: 1px solid white;
    border-radius: 10px;
  }
</style>
