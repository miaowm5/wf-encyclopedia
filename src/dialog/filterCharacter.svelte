<script>
  import { SvelteSet } from 'svelte/reactivity'
  import store from '../store'
  import { Title, ImageLoader } from '../ui'

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

  const vite_cdn = import.meta.env.VITE_CDN
</script>

{#snippet textButton(group, id, text, image = '')}
  <button
    class={`${isFilter(group, id) ? "active" : ""} choice`}
    onclick={()=>triggerFilter(group, id)}
  >
    {#if !image}
      <p>{text}</p>
    {:else}
      <span class="img">
        <ImageLoader src={`${vite_cdn}ui/icon/${image}.png`} alt={text}>
          <p>{text}</p>
        </ImageLoader>
      </span>
    {/if}
  </button>
{/snippet}

<div class="header">筛选</div>
<div class="content">
  <Title>角色名</Title>
  <div class="filterName">
    <input type="text" placeholder="通过角色名搜索" value={currentFilter.text} oninput={(e)=>{
      currentFilter.text = e.target.value
    }}>
  </div>
  <Title>稀有度</Title>
  <div class="group">
    {@render textButton('rarity', '5', '五', 'rarity_five')}
    {@render textButton('rarity', '4', '四', 'rarity_four')}
    {@render textButton('rarity', '3', '三', 'rarity_three')}
    {@render textButton('rarity', '2', '二', 'rarity_two')}
    {@render textButton('rarity', '1', '一', 'rarity_one')}
    {@render textButton('rarity', '0', '其他')}
  </div>
  <Title>属性</Title>
  <div class="group">
    {@render textButton('element', '0', '火', 'element_red_medium')}
    {@render textButton('element', '1', '水', 'element_blue_medium')}
    {@render textButton('element', '2', '雷', 'element_yellow_medium')}
    {@render textButton('element', '3', '风', 'element_green_medium')}
    {@render textButton('element', '4', '光', 'element_white_medium')}
    {@render textButton('element', '5', '暗', 'element_black_medium')}
    {@render textButton('element', '-1', '其他')}
  </div>
  <Title>性别</Title>
  <div class="group">
    {@render textButton('sex', 'Female', '女')}
    {@render textButton('sex', 'Male', '男')}
    {@render textButton('sex', 'Other', '其他')}
  </div>
  <Title>种族</Title>
  <div class="group">
    {@render textButton('race', 'Human', '人', 'race_human_medium2')}
    {@render textButton('race', 'Element', '精灵', 'race_element_medium2')}
    {@render textButton('race', 'Devil', '魔', 'race_devil_medium2')}
    {@render textButton('race', 'Beast', '兽', 'race_beast_medium2')}
    {@render textButton('race', 'Machine', '机械', 'race_machine_medium2')}
    {@render textButton('race', 'Mystery', '妖', 'race_mystery_medium2')}
    {@render textButton('race', 'Dragon', '龙', 'race_dragon_medium2')}
    {@render textButton('race', 'Undead', '不死', 'race_undead_medium2')}
    {@render textButton('race', 'Aquatic', '水棲', 'race_aquatic_medium2')}
    {@render textButton('race', 'Plants', '植物', 'race_plants_medium2')}
  </div>
</div>
<div class="submit">
  <button onclick={closeFilter}>取消</button>
  <button onclick={applyFilter}>确定</button>
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
  .choice>.img{
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
