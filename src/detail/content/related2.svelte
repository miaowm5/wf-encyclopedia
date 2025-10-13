<script>
  import store from '../../store'
  import { Nav } from '../../common'
  import { Title } from '../../ui'

  const { data } = $props()

  const loadDB = store.database('encyclopedia')

  const list = $derived.by(()=>{
    if (!loadDB.finish){ return [] }
    let result = []
    data.forEach((id)=>{
      const item = loadDB.db.encyclopedia[id]
      if (!item){ return }
      if (item.type === 'character' || item.type === 'npc'){ return }
      result.push({name: item.title, id})
    })
    return result
  })
</script>

{#if list.length > 0}

  <Title>{store.i18n("detail.content.related2")}</Title>

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
    max-width: 600px;
    margin: 0 auto;
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
