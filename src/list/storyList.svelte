<script>
  import { Nav } from '../common'
  import store from '../store'
  import { Loading } from '../ui'
  import StoryItem from './storyItem.svelte'
  import ListBanner from './listBanner.svelte'

  const { list } = $props()

  const loadDB = store.database('extra_quest')

  const showList = $derived.by(()=>{
    return list.filter((data)=>data.item.type === 'story')
  })
  const extraList = $derived.by(()=>{
    if (loadDB.finish === false){ return [] }
    const extraStory = loadDB.db.extra_quest
    const list = []
    Object.keys(extraStory).forEach((type)=>{
      Object.keys(extraStory[type]).forEach((id)=>{
        const event = extraStory[type][id]
        let url = ''
        if (type === 'advent_event_quest'){ url = 'ex-adv-quest' }
        else if (type === 'story_event_single_quest'){ url = 'ex-single-quest' }
        list.push({ id, name: [event[2]], item: {eventID: `event_${event[0]}`}, extra: { url } })
      })
    })
    return list
  })
</script>

<ListBanner
  back="keyword_list_world_header_background"
  title="keyword_list_world_title"
  >
  {#snippet content()}
    {#each showList as data}{#key data.id}
      <Nav href={`/${data.id}`} route={store.route}>
        <StoryItem data={data} />
      </Nav>
    {/key}{/each}
    {#if loadDB.finish}
      {#each extraList as data}{#key data.id}
        <Nav href={`/${data.extra.url}/${data.id}`} route={store.route}>
          <StoryItem data={data} />
        </Nav>
      {/key}{/each}
    {:else}
      <Loading />
    {/if}
  {/snippet}
</ListBanner>
