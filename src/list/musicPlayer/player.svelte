<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'

  const { player, songName } = $props()

  const changeSeek = (e)=>{
    if (!songName[0]){ return }
    const rect = e.srcElement.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    player.setSeek(percentage)
    if (!store.state.jukebox.playing){ store.jukebox.play() }
  }

  const playSprite = spriteSheet('res/icon', 'music_play')
  const pauseSprite = spriteSheet('res/icon', 'music_pause')
  const loop1Sprite = spriteSheet('res/icon', 'music_loop1')
  const loop2Sprite = spriteSheet('res/icon', 'music_loop2')
  const nextSprite = spriteSheet('res/icon', 'music_next')
  const lastSprite = spriteSheet('res/icon', 'music_last')
</script>

<div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div onclick={changeSeek} class="player">
    <div class="name">
      <p>{songName[1]}</p>
      <p>{songName[0]}</p>
    </div>
    <span class="progress" style:width={`${player.seek}%`}></span>
  </div>
  <div class="controller">
    <div class="padding"></div>
    <button class="round" onclick={()=>{ player.lastSong() }}>
      <img src={lastSprite.src} alt={store.i18n("detail.music.last")}>
    </button>
    {#if store.state.jukebox.playing}
      <button class="round center" onclick={()=>{ store.jukebox.pause() }}>
        <img src={pauseSprite.src} alt={store.i18n("detail.music.pause")}>
      </button>
    {:else}
      <button class="round center" onclick={()=>{ store.jukebox.play() }}>
        <img src={playSprite.src} alt={store.i18n("detail.music.play")}>
      </button>
    {/if}
    <button class="round" onclick={()=>{ player.nextSong() }}>
      <img src={nextSprite.src} alt={store.i18n("detail.music.next")}>
    </button>
    {#if store.state.jukebox.loop}
      <button class="image" onclick={()=>{ store.jukebox.setLoop(false) }}>
        <img src={loop2Sprite.src} alt={store.i18n("detail.music.loop2")}>
      </button>
    {:else}
      <button class="image" onclick={()=>{ store.jukebox.setLoop(true) }}>
        <img src={loop1Sprite.src} alt={store.i18n("detail.music.loop1")}>
      </button>
    {/if}
  </div>
</div>

<style>
  .player{
    width: 100%;
    position: relative;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
  }
  .progress{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #ffcf8f;
    z-index: 0;
  }
  .name{
    padding: 1em 0 1.5em;
    position: relative;
    z-index: 1;
  }
  .name>p{
    text-align: center;
  }
  .name>p:nth-child(1){
    font-size: .9em;
  }
  .name>p:nth-child(2){
    font-size: 1.2em;
  }
  .controller{
    display: flex;
    gap: .7em .5em;
    justify-content: center;
    align-items: center;
    padding: 1em 0;
  }
  .round{
    border-radius: 50%;
  }
  .round.center{
    width: 3.5em;
    height: 3.5em;
  }
  .controller button{
    padding: 0;
    width: 2.5em;
    height: 2.5em;
  }
  .controller button img{
    width: 100%;
    height: 100%;
  }
  button.round img{
    width: 70%;
    height: 70%;
    margin-top: 15%;
  }
  button.round.center img{
    width: 80%;
    height: 80%;
    margin-top: 10%;
  }
  .image{
    background: none;
    border: none;
    box-shadow: none;
  }
  .padding{
    width: 3em;
  }
</style>
