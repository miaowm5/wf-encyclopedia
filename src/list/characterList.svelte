<script>
  import { Nav } from '../common'
  import store from '../store'
  const { list, select } = $props()
  const showList = $derived.by(()=>{
    return list.filter((data)=>data.item[4] === '0' || data.item[4] === '1' || data.item[4] === '2')
  })
</script>

{#each showList as data}
  <Nav href={`/${data.id}`} route={store.route}>
    <div class={`item ${select === data.id ? 'active' : ''}`}>
      <p>{data.name[0]}</p>
      {#if data.name[1]}<p class="title">{data.name[1]}</p>{/if}
    </div>
  </Nav>
{/each}

<style>
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
</style>
