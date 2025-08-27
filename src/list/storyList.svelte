<script>
  import { Nav } from '../common'
  import store from '../store'
  import StoryItem from './storyItem.svelte'
  const { list, select } = $props()
  const showList = $derived.by(()=>{
    return list.filter((data)=>data.item[4] === '3' || data.item[4] === '4')
  })
</script>

{#each showList as data}{#key data.id}
  <Nav href={`/${data.id}`} route={store.route}>
    <StoryItem data={data} active={select === data.id} />
  </Nav>
{/key}{/each}
