<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  import { Loading } from '../../ui'
  import All from './all.svelte'
  import Single from './single.svelte'

  const loadMusicDB = store.database('music_list')

  const database = $derived.by(()=>{
    if (!loadMusicDB.finish){ return null }
    return loadMusicDB.db['music_list']
  })
  const backSprite = spriteSheet('res/icon', 'return')
</script>

<div class="content">
  <button class="musicBack" onclick={()=>{ store.route.push('/story', true) }}>
    <span style:background-image={`url(${backSprite.src})`}>{store.i18n("detail.music.back")}</span>
  </button>
  <Loading finish={loadMusicDB.finish} error={loadMusicDB.error}>
    <div class="main">
      {#if store.state.extra}
        <Single database={database} path={store.state.extra} />
      {:else}
        <All database={database} />
      {/if}
    </div>
  </Loading>
</div>

<style>
  .content{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .musicBack{
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
  .musicBack>span{
    background-repeat: no-repeat;
    background-position: left;
    background-size: 1.5em 1.5em;
    padding-left: 1.8em;
  }
  .main{
    padding: 0 1em 6em 1em;
    flex: 1;
    overflow: auto;
  }
</style>
