<script>
  import { SvelteSet } from 'svelte/reactivity'
  import store from '../store'
  import { Title, SpriteLoader } from '../ui'

  const getInitValue = ()=>{
    let f = store.state.ui.listFilter
    let result = {}
    Object.keys(f).forEach((name)=>{
      if (name === 'text'){
        result.text = f[name]
        return
      }
      result[name] = new SvelteSet(f[name])
    })
    return result
  }

  let currentFilter = $state(getInitValue())

  const closeFilter = ()=>{
    store.setDialog(null)
  }
  const applyFilter = ()=>{
    const targetFilter = {}
    Object.keys(currentFilter).forEach((name)=>{
      if (name === 'text'){
        if (!currentFilter[name]){ return }
      }else{
        if (currentFilter[name].size === 0){ return }
      }
      targetFilter[name] = currentFilter[name]
    })
    store.changeFilter(targetFilter)
    closeFilter()
  }
  const isFilter = (group, id)=>{
    if (!currentFilter[group]){ return false }
    return currentFilter[group].has(id)
  }
  const triggerFilter = (group, id)=>{
    if (!currentFilter[group]){ currentFilter[group] = new SvelteSet() }
    if (currentFilter[group].has(id)){
      currentFilter[group].delete(id)
    }else{
      currentFilter[group].add(id)
    }
  }
</script>

{#snippet textButton(group, id, text, image = '')}
  <button
    class={`${isFilter(group, id) ? "active" : ""} choice`}
    onclick={()=>triggerFilter(group, id)}
  >
    {#if !image}
      <p>{text}</p>
    {:else}
      <SpriteLoader spritesheet="res/icon" file={image} alt={text} >
        <p>{text}</p>
      </SpriteLoader>
    {/if}
  </button>
{/snippet}

<div class="header">{store.i18n("dialog.filterCharacter.title")}</div>
<div class="content">
  <Title>{store.i18n("dialog.filterCharacter.titleName")}</Title>
  <div class="filterName">
    <input type="text"
      placeholder={store.i18n("dialog.filterCharacter.nameHint")}
      value={currentFilter.text}
      oninput={(e)=>{ currentFilter.text = e.target.value }}
    >
  </div>
  <Title>{store.i18n("dialog.filterCharacter.titleRarity")}</Title>
  <div class="group">
    {@render textButton('rarity', '5', store.i18n("dialog.filterCharacter.rarity1"), 'rarity_five')}
    {@render textButton('rarity', '4', store.i18n("dialog.filterCharacter.rarity2"), 'rarity_four')}
    {@render textButton('rarity', '3', store.i18n("dialog.filterCharacter.rarity3"), 'rarity_three')}
    {@render textButton('rarity', '2', store.i18n("dialog.filterCharacter.rarity4"), 'rarity_two')}
    {@render textButton('rarity', '1', store.i18n("dialog.filterCharacter.rarity5"), 'rarity_one')}
    {@render textButton('rarity', '0', store.i18n("dialog.filterCharacter.rarity6"))}
  </div>
  <Title>{store.i18n("dialog.filterCharacter.titleElement")}</Title>
  <div class="group">
    {@render textButton('element', '0', store.i18n("dialog.filterCharacter.element1"), 'element_red_medium')}
    {@render textButton('element', '1', store.i18n("dialog.filterCharacter.element2"), 'element_blue_medium')}
    {@render textButton('element', '2', store.i18n("dialog.filterCharacter.element3"), 'element_yellow_medium')}
    {@render textButton('element', '3', store.i18n("dialog.filterCharacter.element4"), 'element_green_medium')}
    {@render textButton('element', '4', store.i18n("dialog.filterCharacter.element5"), 'element_white_medium')}
    {@render textButton('element', '5', store.i18n("dialog.filterCharacter.element6"), 'element_black_medium')}
    {@render textButton('element', '-1', store.i18n("dialog.filterCharacter.element7"))}
  </div>
  <Title>{store.i18n("dialog.filterCharacter.titleSex")}</Title>
  <div class="group">
    {@render textButton('sex', 'Female', store.i18n("dialog.filterCharacter.sex1"))}
    {@render textButton('sex', 'Male', store.i18n("dialog.filterCharacter.sex2"))}
    {@render textButton('sex', 'Other', store.i18n("dialog.filterCharacter.sex3"))}
  </div>
  <Title>{store.i18n("dialog.filterCharacter.titleRace")}</Title>
  <div class="group">
    {@render textButton('race', 'Human', store.i18n("dialog.filterCharacter.race1"), 'race_human_medium2')}
    {@render textButton('race', 'Element', store.i18n("dialog.filterCharacter.race2"), 'race_element_medium2')}
    {@render textButton('race', 'Devil', store.i18n("dialog.filterCharacter.race3"), 'race_devil_medium2')}
    {@render textButton('race', 'Beast', store.i18n("dialog.filterCharacter.race4"), 'race_beast_medium2')}
    {@render textButton('race', 'Machine', store.i18n("dialog.filterCharacter.race5"), 'race_machine_medium2')}
    {@render textButton('race', 'Mystery', store.i18n("dialog.filterCharacter.race6"), 'race_mystery_medium2')}
    {@render textButton('race', 'Dragon', store.i18n("dialog.filterCharacter.race7"), 'race_dragon_medium2')}
    {@render textButton('race', 'Undead', store.i18n("dialog.filterCharacter.race8"), 'race_undead_medium2')}
    {@render textButton('race', 'Aquatic', store.i18n("dialog.filterCharacter.race9"), 'race_aquatic_medium2')}
    {@render textButton('race', 'Plants', store.i18n("dialog.filterCharacter.race10"), 'race_plants_medium2')}
  </div>
</div>
<div class="submit">
  <button onclick={closeFilter}>{store.i18n("dialog.filterCharacter.cancel")}</button>
  <button onclick={applyFilter}>{store.i18n("dialog.filterCharacter.ok")}</button>
</div>

<style>
  .content{
    flex: 1;
    overflow: auto;
    padding: 0 .5em 1.5em;
  }
  .header{
    text-align: center;
    padding: 0 0 .8em;
    border-bottom: 2px solid #dedede;
  }
  .filterName{
    text-align: center;
  }
  .filterName>input{
    width: 60%;
    border: 2px solid #dcdcdc;
    padding: .5em;
    background: #fafafa;
    margin: 0 auto;
    font-size: 1em;
  }
  .filterName>input::placeholder{
    color: #bbb;
  }
  .group, .submit{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .group{
    gap: .7em .5em;
    margin-bottom: .5em;
  }
  .choice{
    display: inline-flex;
    align-items: center;
    border-radius: .5em;
    background: #fafafa;
    white-space: nowrap;
    background-repeat: no-repeat;
    background-size: 40% auto;
    background-position: center;
    padding: .8em;
    min-width: 3.5em;
    justify-content: center;
  }
  .choice>p{
    padding: 0 .5em;
  }
  .choice :global > img{
    height: 1em;
  }
  .choice.active{
    background-color: #ffcf8f;
  }
  .submit{
    margin-top: 1em;
    gap: .5em 1em;
    padding-bottom: .5em;
  }
  .submit>button{
    padding: .5em 3em;
    color: white;
    border-radius: .5em;
  }
  .submit>button:nth-child(1){
    background-color: #e93551;
    border: 2px solid #f04064;
  }
  .submit>button:nth-child(2){
    background-color: #2dc4b6;
    border: 2px solid #38d0c6;
  }
</style>
