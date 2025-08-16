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
      character = database2[data[0][5]][0]
    }
    return {data, character}
  })
</script>

<div class={`main ${store.state.ui.mobileListHide ? '' : 'mobileHide'}`}>
  <button class="mobileBack" onclick={()=>{store.setListHide(false)}}>{`<Back`}</button>
  {#if item}{#each item.data as block}
    <div class="item">
      {#each block[20] as line}<p>{line}</p>{/each}
    </div>
  {/each}{/if}
</div>

<style>
  .main{
    flex: 1;
    padding: 1em 1em 10em 1em;
    overflow: auto;
  }
  .item{
    border: 1px solid #ccc;
    display: block;
    margin-bottom: .5em;
    border-radius: 10px;
    padding: .5em 1em;
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

  @media (max-width: 800px) {
    .mobileBack{
      display: inline;
    }
    .mobileHide{
      display: none;
    }
  }
</style>
