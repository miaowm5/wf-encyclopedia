<script>
  import store from '../store'
  import Related1 from './related1.svelte'
  import Related2 from './related2.svelte'
  import Title from './title.svelte'
  import Banner from './banner.svelte'

  const database = store.state.database.encyclopedia
  const database2 = store.state.database.character_text

  const item = $derived.by(()=>{
    const id = store.state.item
    if (!store.state.item){ return null }
    const data = database[id]
    if (!data){ return null }
    let character = null
    if (data[0][4] === '0' || data[0][4] === '1'){
      character = database2[data[0][5]]
    }
    return {data, character}
  })
</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  {#if item}
    <div class="banner">
      {#if item.character}
        <div class="character">
          <div class="info">
            <p>{item.character[3]}</p>
            <p class="name">{item.character[0]}</p>
            <!-- <p>种族：race</p> -->
            <!-- <p>性别：gender</p> -->
            {#if item.character[11] !== '(None)'}<p>CV：{item.character[11]}</p>{/if}
          </div>
        </div>
      {:else if item.data[0][4] === '2'}
        <div class="character">
          <div class="info">
            <p class="name">{item.data[0][17]}</p>
            {#if item.data[0][10] !== '(None)'}<p>种族：{item.data[0][10]}</p>{/if}
            {#if item.data[0][11] !== '(None)'}<p>性别：{item.data[0][11]}</p>{/if}
            {#if item.data[0][9] !== '(None)'}<p>CV：{item.data[0][9]}</p>{/if}
          </div>
        </div>
      {:else if item.data[0][4] === '3' || item.data[0][4] === '4'}
        <Banner data={item.data[0][16]} />
      {:else}
        <div class="header">{item.data[0][17]}</div>
      {/if}
    </div>
    <div class="content">
      <Title>情报</Title>
      {#each item.data as block}
        <div class="item">
          {#each block[20] as line}<p>{line}</p>{/each}
        </div>
      {/each}
      <Related1 data={item.data[0][19]} />
      <Related2 data={item.data[0][19]} />
      <div class="mobileBack">
        <button onclick={()=>{store.setListHide(false)}}>返回一览</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .main{
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .banner{
    flex: 0;
    line-height: 0;
  }
  .content{
    flex: 1;
    padding: 0 1em 10em 1em;
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
  }
  .character{
    color: white;
    padding: 2em 2em 3em;
    background: url(assets/ui/keyword_details_character_background.png);
    background-size: cover;
    background-position: center bottom;
    line-height: 0;
  }
  .character>.info{
    line-height: 2em;
  }
  .character>.info>.name{
    font-size: 1.5em;
  }
  .header{
    background: url(assets/ui/keyword_details_keyword_background.png);
    background-size: cover;
    background-position: center bottom;
    line-height: 0;
    padding: 3em 0;
    text-align: center;
    color: white;
    font-size: 1.5em;
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
