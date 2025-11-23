<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  const { songName } = $props()

  const playMarker = spriteSheet('res/icon', 'music_play')
  const pauseMarker = spriteSheet('res/icon', 'music_pause')
  const listMarker = spriteSheet('res/icon', 'sort')
</script>

<div class="main">
  <button class="song" onclick={()=>{
    if (!songName[0]){ return }
    if (store.state.jukebox.playing){ store.jukebox.pause() }
    else{ store.jukebox.play() }
  }}>
    {#if songName[0]}
      <span class="icon">
        {#if store.state.jukebox.playing}
          <img class="icon" src={pauseMarker.src} alt={store.i18n("detail.music.pause")}>
        {:else}
          <img class="icon" src={playMarker.src} alt={store.i18n("detail.music.play")}>
        {/if}
      </span>
    {/if}
    <span>{songName[0]}</span>
  </button>
  <button class="list" onclick={()=>{ store.triggerJukebox(true) }}>
    <span class="icon"><img src={listMarker.src} alt={store.i18n("detail.music.playlist")}></span>
  </button>
</div>


<style>
  .main{
    font-size: .8em;
    display: flex;
    padding: .5em 0;
    background-color: #fafafa;
    border-top: 1px solid #ddd;
  }
  .main>button{
    border: none;
    box-shadow: none;
    background: none;
    margin: 0;
    text-align: left;
  }
  .main>button:nth-child(1){
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .song>span{
    white-space: nowrap;
  }
  .song>span:nth-child(1){
    flex: none;
  }
  .song>span:nth-child(2){
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .icon{
    display: block;
    height: 2em;
    width: 2em;
  }
  .icon>img{
    max-width: 100%;
    max-height: 100%;
  }
  .main>button:nth-child(2){
    border-left: 1px solid #ddd;
  }
  @media (max-width: 600px) {
    .main{ font-size: .9em; }
  }
  @media (max-width: 400px) {
    .main{ font-size: 1em; }
  }
</style>
