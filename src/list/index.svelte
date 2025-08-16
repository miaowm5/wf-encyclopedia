<script>
  import { Nav } from '../common'
  import store from '../store'
  const database = store.state.database.encyclopedia
  const database2 = store.state.database.character_text
  const list = Object.keys(database)

  const getName = (data)=>{
    if (data[4] === '0'){ return [database2[data[5]][0], database2[data[5]][3]] }
    if (data[4] === '1'){ return [database2[data[5]][0], database2[data[5]][3]] }
    return [data[17]]
  }
</script>

{#snippet item(name)}
	<p>{name[0]}</p>
  {#if name[1]}<p class="title">{name[1]}</p>{/if}
{/snippet}

<div class={`main ${store.state.ui.mobileListHide ? 'mobileHide' : ''}`}>
  {#each list as id}
    <Nav href={`/${id}`} route={store.route}>
      <div class={`item ${store.state.item === id ? 'active' : ''}`}>
        {@render item(getName(database[id][0]))}
      </div>
    </Nav>
  {/each}
</div>

<style>
  .main{
    flex: 1;
    max-width: 500px;
    overflow: auto;
    padding: 1em 1em 10em 1em;
  }
  .item{
    background: #fafafa;
    border-top: 1px solid white;
    display: block;
    margin-bottom: .5em;
    border-radius: 10px;
    padding: .5em 1em;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
  }
  .item:hover{
    background-color: #d3efec;
  }
  .item.active{
    background-color: #d3efec;
    cursor: default;
  }
  .title{
    font-size: .85em;
  }
  @media (max-width: 800px) {
    .main{
      flex: 1;
      max-width: 100%;
    }
    .mobileHide{
      display: none;
    }
  }
</style>
