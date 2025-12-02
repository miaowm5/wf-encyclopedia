<script>
  import store from '../../store'
  import { Title, Loading } from '../../ui'
  import MusicItem from './musicItem.svelte'
  import MobileBack from './mobileBack.svelte'
  import { story } from '../../database/bgmRule.json'

  const { item } = $props()

  const loadMusicDB = store.database('music_list')

  const musicData = $derived.by(()=>{
    if (!loadMusicDB.finish){ return null }
    const musicID = story[item.eventID] || item.eventID
    const database = loadMusicDB.db.music_list
    if (item.subType === 'main' || item.subType === "prologue"){
      return database['world'][musicID] || null
    }
    return database['event'][musicID] || null
  })

</script>

<div class="content">
  <Loading finish={loadMusicDB.finish} error={loadMusicDB.error}>
    {#if musicData}
      <Title>{store.i18n("detail.content.title11")}</Title>
      <div class="list">{#each musicData as item}
        <MusicItem item={item} />
      {/each}</div>
    {/if}
  </Loading>
  <MobileBack />
</div>

<style>
  .content{
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
  }
  .list{
    border-radius: .3em;
    background-color: white;
    padding: .5em 0;
  }
</style>
