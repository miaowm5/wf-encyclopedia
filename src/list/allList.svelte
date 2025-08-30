<script>
  import { Nav } from '../common'
  import store from '../store'
  import ListBanner from './listBanner.svelte'

  const { list, select } = $props()
</script>

<ListBanner
  back="keyword_list_all_header_background"
  title=""
  >
</ListBanner>

{#each list as data}
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
  .title{
    font-size: .85em;
  }
</style>
