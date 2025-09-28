<script>
  import { Nav } from '../common'
  import store from '../store'
  import ListBanner from './listBanner.svelte'

  const { list, select } = $props()

  const showList = $derived.by(()=>{
    const filter = store.state.ui.allListFilter
    return list.filter((data)=>{
      const text = data.name[0] + data.name[1] || ''
      return text.includes(filter)
    })
  })
</script>

<ListBanner
  back="keyword_list_all_header_background"
  title=""
  >
  {#snippet content()}
    {#each showList as data}
      <Nav href={`/${data.id}`} route={store.route}>
        <div class={`item ${select === data.id ? 'active' : ''}`}>
          <p>{data.name[0]}</p>
          {#if data.name[1]}<p class="title">{data.name[1]}</p>{/if}
        </div>
      </Nav>
    {/each}
  {/snippet}
  {#snippet banner()}
    <div class="filter">
      <input type="text"
        value={store.state.ui.allListFilter}
        placeholder={store.i18n("list.allSearchHint")}
        onchange={(e)=>{ store.setAllFilter(e.target.value) }}
      >
    </div>
  {/snippet}
</ListBanner>

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
  .filter{
    position: absolute;
    padding: 1em;
    bottom: .5em;
    width: 100%;
  }
  .filter>input{
    width: 50%;
    min-width: 14em;
    background-color: #eaeaea;
    border-radius: 3em;
    padding: .5em 1em;
    border: none;
    border-top: 1px solid #a2a2a1;
    border-bottom: 1px solid white;
    font-size: 1em;
  }
  .filter>input::placeholder {
    color: #999;
  }
</style>
