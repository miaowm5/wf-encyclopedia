<script>
  import store from '../store'
  import { Nav, HeadIcon } from '../common'
  import Title from './title.svelte'

  const { data } = $props()

  const database = store.state.database.encyclopedia
  const database2 = store.state.database.character_text
  const database3 = store.state.database.character

  const list = $derived.by(()=>{
    let result = []
    data.forEach((id)=>{
      const item = database[id]
      if (!item){ return }
      let character = null
      if (item[0][4] === '0' || item[0][4] === '1'){
        character = { name: database2[item[0][5]][0], head: database3[item[0][5]][0] }
      }else if (item[0][4] === '2'){
        character = { name: item[0][17], head: item[0][7] }
      }else{ return }
      result.push({character, id})
    })
    return result
  })
</script>

{#if list.length > 0}

  <Title>关联角色</Title>

  <div class="tags">
    {#each list as item}
      <span class="tag">
        <Nav href={`/${item.id}`} route={store.route}>
          <div class="border1"><div class="border2">
            <HeadIcon name={item.character.name} file={item.character.head} />
          </div></div>
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
  .border2{
    border: 1px solid #ababab;
    background-color: #232223;
  }
  .border1{
    border: 4px solid white;
  }
</style>
