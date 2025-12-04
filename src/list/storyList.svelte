<script>
  import { Nav } from '../common'
  import store from '../store'
  import { Loading, TextImage } from '../ui'
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
        list.push({ id: `${url}/${id}`, name: [event[2]], item: {eventID: `event_${event[0]}`}, extra: {} })
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
    <Loading finish={loadDB.finish} error={loadDB.error}>
      {#each extraList as data}{#key data.id}
        <Nav href={`/${data.id}`} route={store.route}>
          <StoryItem data={data} />
        </Nav>
      {/key}{/each}
      <div class="item">
        <Nav href="/music" route={store.route}>
          <TextImage
            text={store.i18n("detail.music.allButton")}
            width={1000}
            height={184}
            style={{
              color: '#444444',
              background: '#eaeaea',
              size: '45px'
            }}
          />
        </Nav>
      </div>
    </Loading>
  {/snippet}
</ListBanner>

<style>
  .item{
    width: 100%;
    text-align: center;
    position: relative;
    border: 4px solid white;
    border-radius: 8px;
    overflow: hidden;
    line-height: 0;
    margin-bottom: .5em;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
  }
</style>
