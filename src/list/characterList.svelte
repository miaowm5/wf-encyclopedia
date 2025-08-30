<script>
  import { Nav } from '../common'
  import store from '../store'
  import ListBanner from './listBanner.svelte'
  const { list, select } = $props()
  const showList = $derived.by(()=>{
    return list.filter((data)=>data.item[4] === '0' || data.item[4] === '1' || data.item[4] === '2')
  })
</script>

<ListBanner
  back="keyword_list_character_header_background"
  title="keyword_list_character_title"
  >
  <button class="filter">
    <p>筛选</p>
  </button>
</ListBanner>

{#each showList as data}
  <Nav href={`/${data.id}`} route={store.route}>
    <div class={`item ${select === data.id ? 'active' : ''}`}>
      <p>{data.name[0]}</p>
      {#if data.name[1]}<p class="title">{data.name[1]}</p>{/if}
    </div>
  </Nav>
{/each}

<style>
  .filter{
    border-radius: 100%;
    width: 3em;
    height: 3em;
    position: absolute;
    left: .5em;
    bottom: 1em
  }
  .filter>p{
    font-size: .9em;
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
  .item>.title{
    font-size: .85em;
  }
</style>
