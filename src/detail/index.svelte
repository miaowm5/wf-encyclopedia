<script>
  import store from '../store'

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
    <button class="mobileBack" onclick={()=>{store.setListHide(false)}}>{`<Back`}</button>
    {#if item.character}
      <div class="character">
        <p>{item.character[3]}</p>
        <p class="name">{item.character[0]}</p>
        <!-- <p>种族：race</p> -->
        <!-- <p>性别：gender</p> -->
        {#if item.character[11] !== '(None)'}
          <p>CV：{item.character[11]}</p>
        {/if}
      </div>
    {:else if item.data[0][4] === '2'}
      <div class="character">
        <p class="name">{item.data[0][17]}</p>
        {#if item.data[0][10] !== '(None)'}<p>种族：{item.data[0][10]}</p>{/if}
        {#if item.data[0][11] !== '(None)'}<p>性别：{item.data[0][11]}</p>{/if}
        {#if item.data[0][9] !== '(None)'}<p>CV：{item.data[0][9]}</p>{/if}
      </div>
    {:else}
      <div class="character">
        <p class="name">{item.data[0][17]}</p>
      </div>
    {/if}
    {#each item.data as block}
      <div class="item">
        {#each block[20] as line}<p>{line}</p>{/each}
      </div>
    {/each}
  {/if}
</div>

<style>
  .main{
    flex: 1;
    padding: 1em 1em 10em 1em;
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
    background: none;
    border: none;
    border-bottom: 1px solid #ccc;
    width: 100%;
    text-align: left;
    margin-bottom: 1em;
    padding: .5em;
    cursor: pointer;
  }
  .character{
    margin-bottom: 1.5em;
  }
  .character>.name{
    font-size: 1.5em;
  }

  @media (max-width: 800px) {
    .mobileBack{
      display: inline;
    }
    .mobileHide{
      display: none;
    }
  }
</style>
