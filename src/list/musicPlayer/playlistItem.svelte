<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  const { title, play, remove, active } = $props()

  const songName = $derived.by(()=>{
    if (!title){ return ['',''] }
    let parts = title.split('/')
    let file = parts.pop()
    return [file.slice(0, file.length - 4), parts.join('/')]
  })

  const removeSprite = spriteSheet('res/icon', 'music_remove')
  const playSprite = spriteSheet('res/icon', 'music_play')
</script>

{#if songName[0]}
<div class="main">
  <button class="play" onclick={()=>play(title)}>
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
  <button class="remove" onclick={()=>remove(title)}>
    <img src={removeSprite.src} alt={store.i18n("detail.music.removeList")}>
  </button>
</div>
{/if}

<style>
  .main{
    display: flex;
    margin: .5em 0;
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
  }
  .playmark{
    width: 1em;
    height: 1em;
    background-size: cover;
    background-position: center center;
    margin-right: .5em;
  }
  .remove{
    width: 3em;
    text-align: center;
  }
  .remove img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
