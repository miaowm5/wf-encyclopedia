<script>
  import store from '../../store'
  import { Nav } from '../../common'
  import { Title, HeadIcon } from '../../ui'

  const { data } = $props()

  const database = store.state.database.encyclopedia
  const database2 = store.state.database.character_text
  const database3 = store.state.database.character

  const list = $derived.by(()=>{
    let result = []
    data.forEach((id)=>{
      const item = database[id]
      if (!item){ return }
      let character = {}
      if (item[0][4] === '0' || item[0][4] === '1'){
        character = {
          name: database2[item[0][5]][0],
          head: database3[item[0][5]][0],
          rarity: database3[item[0][5]][2],
          element: database3[item[0][5]][3],
        }
      }else if (item[0][4] === '2'){
        character = { name: item[0][17], head: item[0][7] }
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
  }
  .tag{
    max-width: 17%;
    position: relative;
    line-height: 0;
    border: 1px solid #ababab;
    border-radius: 5px;
    overflow: hidden;
  }
</style>
