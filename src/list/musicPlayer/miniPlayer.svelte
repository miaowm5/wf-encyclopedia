<script>
  import store from '../../store'
  const { songName } = $props()
</script>

<div class="main">
  <button onclick={()=>{
    if (!songName[0]){ return }
    if (store.state.jukebox.playing){ store.jukebox.pause() }
    else{ store.jukebox.play() }
  }}>
    {#if songName[0]}
      <span>{store.state.jukebox.playing ? store.i18n("暂停") : store.i18n("播放")}</span>
    {/if}
    <span>{songName[0]}</span>
  </button>
  <button onclick={()=>{ store.triggerJukebox(true) }}>
    <span>{store.i18n("列表")}</span>
  </button>
</div>


<style>
  .main{
    display: flex;
    padding: .5em 1em;
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
  }
  .main>button>span{
    white-space: nowrap;
  }
  .main>button:nth-child(1)>span:nth-child(1){
    flex: none;
  }
  .main>button:nth-child(1)>span:nth-child(2){
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
