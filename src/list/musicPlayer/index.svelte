<script>
  import store from '../../store'
  import playerLogic from './player.svelte.js'
  import { Loading } from '../../ui'

  const player = playerLogic()
  const current = $derived(store.state.jukebox.current)
  const playlist = $derived(store.state.jukebox.playList)

  const loadDB = store.database('music_list')

</script>

<div class="main">
  <p>{current || playlist[0] || ''}</p>
  <span class="progress" style:width={`${player.seek}%`}></span>
  {#if store.state.jukebox.playing}
    <button onclick={()=>{ store.jukebox.pause() }}>暂停</button>
  {:else}
    <button onclick={()=>{ store.jukebox.play() }}>播放</button>
  {/if}

  <div>
    <p>播放列表({playlist.length})</p>
    {#each playlist as title, index}
      <div>
        <span>{title}</span>
        {#if current === title}
          <span>（正在播放）</span>
        {:else}
          <button onclick={()=>{ store.jukebox.play(title) }}>播放</button>
        {/if}
        <button onclick={()=>{ store.jukebox.remove(title) }}>移除</button>
      </div>
    {/each}
  </div>

  <Loading finish={loadDB.finish} error={loadDB.error}>
    <br><br>
      <button onclick={()=>{
        store.jukebox.add(loadDB.db['music_list'])
      }}>全部添加到列表</button>
    <br><br>
    <div class="music-player">
      {#each loadDB.db['music_list'] as title}
        {#if !playlist.includes(title)}
          <div class="music-item">
            <p class="music-title">{title}</p>
            <button onclick={()=>{
              store.jukebox.add([title])
              store.jukebox.play(title)
            }}>
              添加并播放
            </button>
          </div>
        {/if}
      {/each}
    </div>
  </Loading>
</div>

<style>
  .main{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: white;
    padding: 1em;
  }
  .progress{
    display: block;
    width: 100%;
    height: 1em;
    background: #ffcf8f;
  }
</style>
