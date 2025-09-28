<script>
  import { Nav } from '../common'
  import store from '../store'
  import ListBanner from './listBanner.svelte'
  const { list, select } = $props()
  const showList = $derived.by(()=>{
    let result = list.filter((data)=>data.item[4] === '0' || data.item[4] === '1' || data.item[4] === '2')
    const filter = store.state.ui.listFilter
    Object.keys(filter).forEach((type)=>{
      let filterInfo = filter[type]
      if (!filterInfo) return true
      if (type === 'rarity'){
        result = result.filter((data)=>{
          if (data.item[4] === '2'){ return filterInfo.has('0') }
          return filterInfo.has(data.extra[2])
        })
      }else if (type === 'element'){
        result = result.filter((data)=>{
          if (data.item[4] === '2'){ return filterInfo.has('-1') }
          return filterInfo.has(data.extra[3])
        })
      }else if (type === 'sex'){
        result = result.filter((data)=>{
          let gender = ''
          if (data.item[4] === '2'){ gender = data.item[11] }
          else{ gender = data.extra[7] }
          if (gender !== 'Male' && gender !== 'Female'){ return filterInfo.has('Other') }
          return filterInfo.has(gender)
        })
      }else if (type === 'race'){
        result = result.filter((data)=>{
          let race = ''
          if (data.item[4] === '2'){ race = data.item[10] }
          else{ race = data.extra[4] }
          return race.split(',').some((r)=>filterInfo.has(r))
        })
      }else if (type === 'text'){
        result = result.filter((data)=>{
          const text = data.name[0] + data.name[1] || ''
          return text.includes(filterInfo)
        })
      }
    })
    return result
  })
</script>

<ListBanner
  back="keyword_list_character_header_background"
  title="keyword_list_character_title"
  >
  {#snippet banner()}
    <button class="filter" onclick={()=>store.setDialog('filterCharacter')}>
      <p>{store.i18n("list.characterFilterButton")}</p>
    </button>
  {/snippet}
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
</ListBanner>

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
