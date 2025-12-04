<script>
  import store from '../../store'
  import { Title, MusicItem } from '../../ui'
  import bgmRule from '../../database/bgmRule.json'

  const { database } = $props()

  const list = $derived.by(()=>{
    if (!database){ return null }
    let list = [[],[]]
    bgmRule.common.forEach((id)=>{ list[0] = list[0].concat(database['common'][id]) })
    bgmRule.exstory.forEach((id)=>{ list[1] = list[1].concat(database['event'][id]) })
    return list
  })
</script>

{#if list}
  <Title>{store.i18n("detail.music.title1")}</Title>
  <div class="list">{#each list[0] as item}
    <MusicItem item={item} />
  {/each}</div>
  <Title>{store.i18n("detail.music.title2")}</Title>
  <div class="list">{#each list[1] as item}
    <MusicItem item={item} />
  {/each}</div>
{/if}

<style>
  .list{
    border-radius: .3em;
    background-color: white;
    padding: .5em 0;
  }
</style>
