<script>
  import store from '../../store'
  import { Nav } from '../../common'
  import { Title, HeadIcon } from '../../ui'

  const { data } = $props()

  const loadDB = store.database('encyclopedia', 'character_text', 'character')

  const list = $derived.by(()=>{
    if (!loadDB.finish){ return [] }
    let result = []
    const database = loadDB.db.encyclopedia
    const database2 = loadDB.db.character_text
    const database3 = loadDB.db.character
    data.forEach((id)=>{
      const item = database[id]
      if (!item){ return }
      let character = {}
      if (item.type === 'character'){
        character = {
          name: database2[item.characterID][0],
          head: database3[item.characterID][0],
          rarity: database3[item.characterID][2],
          element: database3[item.characterID][3],
        }
      }else if (item.type === 'npc'){
        character = { name: item.title, head: item.headID }
      }else{ return }
      result.push({...character, id})
    })
    return result
  })
</script>

{#if list.length > 0}

  <Title>{store.i18n("detail.content.related1")}</Title>

  <div class="tags">
    {#each list as item}
      <span class="tag">
        <Nav href={`/${item.id}`} route={store.route}>
          <HeadIcon
            name={item.name}
            file={item.head}
            rarity={item.rarity}
            element={item.element}
          />
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
  .tag{
    max-width: 80px;
    max-width: min(80px, 17%);
    position: relative;
    line-height: 0;
  }
</style>
