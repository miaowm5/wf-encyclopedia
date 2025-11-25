<script>
  import store from '../../store'
  import { spriteSheet, OnBack } from '../../common'
  import Item from './playlistItem.svelte'
  import Player from './player.svelte'

  const { player, songName } = $props()

  const current = $derived(store.state.jukebox.current)
  const playlist = $derived(store.state.jukebox.playList)
  const backSprite = spriteSheet('res/icon', 'return')
  const playListSprite = spriteSheet('res/icon', 'sort')

  const close = ()=>{ store.triggerJukebox(false) }
</script>

<div class="main">
  <OnBack route={store.route} func={close} />
  <button class="back" onclick={close}>
    <span style:background-image={`url(${backSprite.src})`}>{store.i18n("detail.music.back")}</span>
  </button>
  {#if songName[0]}<Player player={player} songName={songName} />{/if}
  <div class="playlist">
    <p class="title" style:background-image={`url(${playListSprite.src})`}>
      {store.i18n("detail.music.playlist")}({playlist.length})
    </p>
    <div class="list">
      <div>{#each playlist as title}
        <Item
          title={title} active={current === title}
          play={store.jukebox.play}
          remove={store.jukebox.remove}
        />
      {/each}</div>
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
  .back>span{
    background-repeat: no-repeat;
    background-position: left;
    background-size: 1.5em 1.5em;
    padding-left: 1.8em;
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
    border-bottom: 1px solid #ccc;
    background-repeat: no-repeat;
    background-position: left;
    background-size: 1.5em 1.5em;
    padding-left: 1.5em;
    margin-top: -.5em;
  }
  .playlist .list{
    flex: 1;
    overflow-y: auto;
    padding: 1em 1em 3em 1em
  }
  .playlist .list>div{
    border-radius: 10px;
    background-color: white;
    padding: .5em 0;
  }
</style>
