<script>
  import store from '../store'
  import Related1 from './related1.svelte'
  import Related2 from './related2.svelte'
  import Title from './title.svelte'
  import Banner from './bannerTitle.svelte'
  import NormalTitle from './normalTitle.svelte'
  import CharacterTitle from './characterTitle.svelte'
  import NpcTitle from './npcTitle.svelte'

  const database = store.state.database.encyclopedia

  const item = $derived.by(()=>{
    const id = store.state.item
    if (!store.state.item){ return null }
    const data = database[id]
    return data
  })
</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  {#if item}{#key store.state.item}
    {#if item[0][4] === '0' || item[0][4] === '1'}
      <CharacterTitle data={item} />
    {:else if item[0][4] === '2'}
      <NpcTitle
        name={item[0][17]}
        race={item[0][10]}
        gender={item[0][11]}
        cv={item[0][9]}
        banner={item[0][6]}
      />
    {:else if item[0][4] === '3' || item[0][4] === '4'}
      <Banner data={item[0][16]} title={item[0][17]} />
    {:else}
      <NormalTitle title={item[0][17]} />
    {/if}
    <div class="content">
      <Title>情报</Title>
      {#each item as block}
        <div class="item">
          {#each block[20] as line}<p>{line}</p>{/each}
        </div>
      {/each}
      <Related1 data={item[0][19]} />
      <Related2 data={item[0][19]} />
      <div class="mobileBack">
        <button onclick={()=>{store.setListHide(false)}}>返回一览</button>
      </div>
    </div>
  {/key}{/if}
</div>

<style>
  .main{
    flex: 3;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .content{
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
  }
  .item{
    display: block;
    margin-bottom: .5em;
    border-radius: 10px;
    padding: 1em;
    background-color: white;
  }
  .mobileBack{
    display: none;
    text-align: center;
  }
  .mobileBack>button{
    background: #fafafa;
    border: none;
    border-top: 1px solid white;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
    border-radius: 10px;
    text-align: left;
    margin-bottom: 1em;
    padding: .6em 1.5em;
    cursor: pointer;
    display: inline-block;
    font-size: 1em;
    color: #555555;
  }
  @media (max-width: 800px) {
    .mobileBack{
      margin-top: 3em;
      display: block;
    }
    .mobileHide{
      display: none;
    }
  }
</style>
