<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  import { Title, Loading, MusicItem } from '../../ui'
  import bgmRule from '../../database/bgmRule.json'

  const loadMusicDB = store.database('music_list')

  const list = $derived.by(()=>{
    if (!loadMusicDB.finish){ return null }
    const database = loadMusicDB.db['music_list']
    let list = [[],[]]
    bgmRule.common.forEach((id)=>{ list[0] = list[0].concat(database['common'][id]) })
    bgmRule.exstory.forEach((id)=>{ list[1] = list[1].concat(database['event'][id]) })
    return list
  })
  const backSprite = spriteSheet('res/icon', 'return')
</script>

<div class="content">
  <button class="musicBack" onclick={()=>{ store.setScenario(null) }}>
    <span style:background-image={`url(${backSprite.src})`}>{store.i18n("detail.content.storyBack")}</span>
  </button>
  <Loading finish={loadMusicDB.finish} error={loadMusicDB.error}>
    <div class="main">
      {#if list}
        <Title>{store.i18n("detail.music.common")}</Title>
        <div class="list">{#each list[0] as item}
          <MusicItem item={item} />
        {/each}</div>
        <Title>{store.i18n("detail.music.event")}</Title>
        <div class="list">{#each list[1] as item}
          <MusicItem item={item} />
        {/each}</div>
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
  .list{
    border-radius: .3em;
    background-color: white;
    padding: .5em 0;
  }
</style>
