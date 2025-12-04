<script>
  import store from '../store'
  import { spriteSheet } from '../common'
  const { title = '', item = null } = $props()

  const fullPath = $derived.by(()=>{
    if (item){ return `${item.path}/${item.name}.mp3` }
    if (title){ return title }
    return ''
  })
  const songName = $derived.by(()=>{
    if (item){ return [item.name, item.path] }
    if (title){
      let parts = title.split('/')
      let file = parts.pop()
      return [file.slice(0, file.length - 4), parts.join('/')]
    }
    return ['','']
  })

  const removeSprite = spriteSheet('res/icon', 'music_remove')
  const addSprite = spriteSheet('res/icon', 'music_add')
  const playSprite = spriteSheet('res/icon', 'music_play')

  const active = $derived.by(()=>{
    return store.state.jukebox.current === fullPath && store.state.jukebox.playing
  })
  const inlist = $derived.by(()=>{
    return store.state.jukebox.playList.some((i)=>i === fullPath)
  })
  const triggerList = ()=>{
    if (inlist){ store.jukebox.remove(fullPath) }
    else{ store.jukebox.add([fullPath]) }
  }
</script>

{#if songName[0]}
<div class="main">
  <button class="play" onclick={()=>store.jukebox.play(fullPath)}>
    {#if active}
      <div class="playmark" style:background-image={`url(${playSprite.src})`}></div>
    {:else}
      <div class="playmark"></div>
    {/if}
    <div class="name">
      <p>{songName[0]}</p>
      <p>{songName[1]}</p>
    </div>
  </button>
  <button class="trigger" onclick={triggerList}
    title={store.i18n(inlist ? "detail.music.removeList" : "detail.music.addList")}>
    {#if inlist}
      <img src={removeSprite.src} alt={store.i18n("detail.music.removeList")}>
    {:else}
      <img src={addSprite.src} alt={store.i18n("detail.music.addList")} class="add">
    {/if}
  </button>
</div>
{/if}

<style>
  .main{
    display: flex;
  }
  .main button{
    background: none;
    border: none;
    box-shadow: none;
  }
  .name>p{
    text-align: left;
    position: relative;
    word-break: break-all;
    word-wrap: break-word;
  }
  .name>p:nth-child(2){
    color: #888;
    font-size: .9em;
  }
  .play{
    display: flex;
    flex: 1;
    align-items: center;
    padding: .7em 0;
  }
  .playmark{
    width: 1em;
    height: 1em;
    background-size: cover;
    background-position: center center;
    margin: 0 .5em 0 .7em;
  }
  .trigger{
    width: 3em;
    text-align: center;
  }
  .trigger img{
    max-width: 100%;
    max-height: 100%;
  }
  .trigger .add{
    opacity: .3;
  }
</style>
