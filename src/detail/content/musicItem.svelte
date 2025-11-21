<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'

  const { item } = $props()

  const fullPath = $derived(`${item.path}/${item.name}.mp3`)

  const isPlaying = $derived.by(()=>{
    return store.state.jukebox.current === fullPath && store.state.jukebox.playing
  })
  const isOnPlaylist = $derived.by(()=>{
    return store.state.jukebox.playList.some((i)=>i === fullPath)
  })

  const playMarker = spriteSheet('res/icon', 'voice_volume3')
  const addListMarker = spriteSheet('res/icon', 'voice_volume3')

</script>

<div class="voice">
  <div class="text"><p>{item.name}</p></div>
  <p class="comment">{item.path}</p>
</div>
<div class="btnGroup">
  {#if isPlaying}
    <div class="btn playing"><span>
      <img src={playMarker.src} alt={store.i18n('detail.music.playing')}>
      <span>{store.i18n('detail.music.playing')}</span>
    </span></div>
  {:else}
    <button class="btn" onclick={()=>{ store.jukebox.play(fullPath) }}><span>
      <img src={playMarker.src} alt={store.i18n('detail.music.play')}>
      <span>{store.i18n('detail.music.play')}</span>
    </span></button>
  {/if}
  {#if !isOnPlaylist}
    <button class="btn" onclick={()=>{ store.jukebox.add(fullPath); store.jukebox.play(fullPath) }}><span>
      <img src={addListMarker.src} alt={store.i18n('detail.music.addList')}>
      <span>{store.i18n('detail.music.addList')}</span>
    </span></button>
  {/if}
</div>

<style>
  .voice{
    display: inline-block;
    border: none;
    background: white;
    text-align: left;
    padding: 1em 1.5em 1em 1em;
    border-radius: .3em;
    box-shadow: none;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .voice>.text, .voice>.comment{
    position: relative;
    z-index: 1;
    word-break: break-all;
    word-wrap: break-word;
  }
  .voice>.comment{
    color: #888;
    font-size: .9em;
  }
  .btnGroup{
    margin-bottom: 1em;
    margin-top: .3em;
  }
  .btnGroup>*:not(:last-child){
    margin-right: .3em;
  }
  .btn{
    background: #fafafa;
    border: none;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
    cursor: pointer;
    font-size: 1em;
    color: #444444;
    display: inline-block;
    overflow: hidden;
    border-radius: .3em;
    padding: 0 .5em;
  }
  .btn.playing{
    background-color: #ffcf8f;
  }
  .btn>span{
    display: flex;
    align-items: center;
  }
  .btn>span>img{
    height: 2em;
    width: 2em;
  }
</style>
