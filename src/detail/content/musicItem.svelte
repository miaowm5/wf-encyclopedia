<script>
  import store from '../../store'

  const { item } = $props()

  const fullPath = $derived(`${item.path}/${item.name}.mp3`)

  const isPlaying = $derived.by(()=>{
    return store.state.jukebox.current === fullPath && store.state.jukebox.playing
  })
  const isOnPlaylist = $derived.by(()=>{
    return store.state.jukebox.playList.some((i)=>i === fullPath)
  })

</script>

<div class="voice">
  <div class="text"><p>{item.name}</p></div>
  <p class="comment">{item.path}</p>
  {#if isPlaying}
    <span>playing</span>
  {:else}
    <button onclick={()=>{ store.jukebox.play(fullPath) }}>play</button>
  {/if}
  {#if !isOnPlaylist}
    <button onclick={()=>{ store.jukebox.add(fullPath); store.jukebox.play(fullPath) }}>add to playlist</button>
  {/if}
</div>

<style>
  .voice{
    display: inline-block;
    border: none;
    background: white;
    margin-bottom: 1em;
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
</style>
