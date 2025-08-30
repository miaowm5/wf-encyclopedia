<script>
  import store from '../store'
  import { SvelteSet } from 'svelte/reactivity'

  const currentFilter = $state(store.state.ui.listFilter)
  const closeFilter = ()=>{
    store.triggerFilter(false)
  }
  const applyFilter = ()=>{
    store.changeFilter(currentFilter)
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
      if (currentFilter[group].size === 0){ currentFilter[group] = undefined }
    }else{
      currentFilter[group].add(id)
    }
    currentFilter[group] = currentFilter[group]
  }
  store.route.onBack(closeFilter)
</script>

{#snippet title(text)}
  <p class="title">{text}</p>
{/snippet}

{#snippet textButton(group, id, text)}
  <button
    class={`${isFilter(group, id) ? "active" : ""} choice`}
    onclick={()=>triggerFilter(group, id)}
  >
    {text}
  </button>
{/snippet}

<div class="main"><div class="dialog">
  <div class="header">筛选</div>
  {@render title('稀有度')}
  <div class="group">
    {@render textButton('rarity', '5', '五')}
    {@render textButton('rarity', '4', '四')}
    {@render textButton('rarity', '3', '三')}
    {@render textButton('rarity', '2', '二')}
    {@render textButton('rarity', '1', '一')}
    {@render textButton('rarity', '0', '其他')}
  </div>
  {@render title('属性')}
  <div class="group">
    {@render textButton('element', '1', '火')}
    {@render textButton('element', '2', '水')}
    {@render textButton('element', '3', '雷')}
    {@render textButton('element', '4', '风')}
    {@render textButton('element', '5', '光')}
    {@render textButton('element', '6', '暗')}
    {@render textButton('element', '0', '其他')}
  </div>
  {@render title('性别')}
  <div class="group">
    {@render textButton('sex', '1', '女')}
    {@render textButton('sex', '2', '男')}
    {@render textButton('sex', '0', '其他')}
  </div>
  {@render title('种族')}
  <div class="group">
    {@render textButton('race', 'Human', '人')}
    {@render textButton('race', 'Element', '精灵')}
    {@render textButton('race', 'Devil', '魔')}
    {@render textButton('race', 'Beast', '兽')}
    {@render textButton('race', 'Machine', '机械')}
    {@render textButton('race', 'Mystery', '妖')}
    {@render textButton('race', 'Dragon', '龙')}
    {@render textButton('race', 'Undead', '不死')}
    {@render textButton('race', 'Aquatic', '水棲')}
    {@render textButton('race', 'Plants', '植物')}
  </div>
  <div class="submit">
    <button onclick={closeFilter}>取消</button>
    <button onclick={applyFilter}>确定</button>
  </div>
</div></div>

<style>
  .main{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255,255,255,.5);
    z-index: 100;
  }
  .dialog{
    width: 80%;
    max-height: 80%;
    background-color: #fafafa;
    overflow: auto;
    border: 2px solid white;
    border-radius: 1em;
    box-shadow: 0 0 8px rgba(0,0,0,.3);
    padding: 1em;
  }
  .header{
    text-align: center;
    padding: 0 0 .8em;
    border-bottom: 2px solid #dedede;
  }
  .title{
    text-align: center;
    padding: .5em 0;
  }
  .group, .submit{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .group{
    gap: .7em .5em;
  }
  .choice{
    display: inline-flex;
    align-items: center;
    padding: .8em 1.3em;
    border-radius: .5em;
    background: #fafafa;
    white-space: nowrap;
  }
  .choice.active{
    background-color: #ffcf8f;
  }
  .submit{
    margin-top: 1.5em;
    gap: .5em 1em;
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
