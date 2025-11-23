<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  import Item from './playlistItem.svelte'
  import Player from './player.svelte'

  const { player, songName } = $props()

  const current = $derived(store.state.jukebox.current)
  const playlist = $derived(store.state.jukebox.playList)
  const backSprite = spriteSheet('res/icon', 'return')
  const playListSprite = spriteSheet('res/icon', 'sort')
</script>

<div class="main">
  <button class="back" onclick={()=>{ store.triggerJukebox(false) }}>
    <img src={backSprite.src} alt={store.i18n("detail.music.back")}>
    {store.i18n("detail.music.back")}
  </button>
  {#if songName[0]}<Player player={player} songName={songName} />{/if}
  <div class="playlist">
    <p class="title">
      <span><img class="icon" src={playListSprite.src} alt={store.i18n("detail.music.playlist")}></span>
      <span>{store.i18n("detail.music.playlist")}({playlist.length})</span>
    </p>
    <div class="list">
      {#each playlist as title}
        <Item
          title={title} active={current === title}
          play={store.jukebox.play}
          remove={store.jukebox.remove}
        />
      {/each}
    </div>
  </div>
</div>

<style>
  .main{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #eaeaea;
    display: flex;
    flex-direction: column;
  }
  .back{
    display: inline-block;
    border: none;
    border-bottom: 1px solid #eaeaea;
    background: white;
    text-align: left;
    padding: .8em .8em .5em;
    box-shadow: none;
    font-size: .9em;
    position: relative;
    line-height: 1.5em;
  }
  .back :global img{
    height: 1.5em;
    margin-bottom: -.4em;
  }
  .playlist{
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .playlist .title{
    display: flex;
    align-items: center;
    padding: .5em 0;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .playlist .title>span:nth-child(1){
    line-height: 0;
  }
  .playlist .title>span>img{
    width: 1.5em;
    height: 1.5em;
  }
  .playlist .list{
    flex: 1;
    overflow-y: auto;
  }
</style>
