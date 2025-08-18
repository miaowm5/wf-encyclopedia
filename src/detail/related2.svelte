<script>
  import store from '../store'
  import { Nav } from '../common'
  import Title from './title.svelte'

  const { data } = $props()

  const database = store.state.database.encyclopedia

  const list = $derived.by(()=>{
    let result = []
    data.forEach((id)=>{
      const item = database[id]
      if (!item){ return }
      if (['0','1','2'].includes(item[0][4])){ return }
      result.push({name: item[0][17], id})
    })
    return result
  })
</script>

{#if list.length > 0}

  <Title>关联关键词</Title>

  <div class="tags">
    {#each list as item}
      <span class="tag">
        <Nav href={`/${item.id}`} route={store.route}>
          {item.name}
        </Nav>
      </span>
    {/each}
  </div>
{/if}

<style>
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: .7em .5em;
    justify-content: center;
  }
  .tag {
    font-size: .9em;
    display: inline-flex;
    align-items: center;
    padding: .2em 1em;
    border-radius: 999px;
    background: #fafafa;
    color: #2bcaba;
    white-space: nowrap;
    border-bottom: 2px solid #a4a4a4;
    border-top: 1px solid white;
  }
</style>
