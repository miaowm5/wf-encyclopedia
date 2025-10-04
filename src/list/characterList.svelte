<script>
  import { Nav } from '../common'
  import store from '../store'
  import { HeadIcon, RoundButton } from '../ui'
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
    <span class="filter">
      <RoundButton
        icon="sort"
        onclick={()=>store.setDialog('filterCharacter')}
        title={store.i18n("list.characterFilterButton")}
      />
    </span>
  {/snippet}
  {#snippet content()}<div class="list">
    {#each showList as data}
      <span class="item">
        <Nav href={`/${data.id}`} route={store.route}>
          <HeadIcon
            file={data.item[4] === '2' ? data.item[7] : data.extra[0]}
            name={data.name[0]}
            rarity={data.extra[2]}
            element={data.extra[3]}
            showName={true}
          />
        </Nav>
      </span>
    {/each}</div>
  {/snippet}
</ListBanner>

<style>
  .filter{
    position: absolute;
    left: .5em;
    bottom: 1em
  }
  .list{
    display: flex;
    flex-wrap: wrap;
    gap: .7em 8%;
    padding: 0 8%;
  }
  .item{
    display: inline-block;
    width: 19%;
  }
</style>
