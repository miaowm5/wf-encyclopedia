<script>
  import { Nav } from '../common'
  import store from '../store'
  import StoryItem from './storyItem.svelte'
  import ListBanner from './listBanner.svelte'

  const { list, select } = $props()
  const showList = $derived.by(()=>{
    return list.filter((data)=>data.item[4] === '3' || data.item[4] === '4' || data.item[4] === '5')
  })
</script>

<ListBanner
  back="keyword_list_world_header_background"
  title="keyword_list_world_title"
  >
  {#snippet content()}
    {#each showList as data}{#key data.id}
      <Nav href={`/${data.id}`} route={store.route}>
        <StoryItem data={data} active={select === data.id} />
      </Nav>
    {/key}{/each}
  {/snippet}
</ListBanner>
