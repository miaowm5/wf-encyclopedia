<script>
  import store from '../../store'
  import { RoundButton, Loading } from '../../ui'
  import loadData from './loadEquipment.svelte.js'
  import MobileBack from './mobileBack.svelte'

  const { item } = $props()

  const database = $derived.by(()=>{ return store.state.database.equipment })
  const loadState = loadData()

  const data = $derived.by(()=>{
    if (!loadState.finish){ return null }
    if (!database){ return null }
    let chapter = item[0][12]
    let result = database[100000 + (chapter - 0)]
    if (!result){ return null }
    return [result[0][1], result[0][5]]
  })

  const url = import.meta.env.VITE_CDN + `orb/chapter${item[0][12]}.png`

</script>

<div class="content">
  <div class="image">
    <img src={url} alt={data ? data[0] : `${item[0][17]}`} />
    <RoundButton icon="full_size" onclick={()=>window.open(url)} />
  </div>
  {#if !loadState.finish}
    {#if loadState.error.length > 0}
      <p>{loadState.error[0]}</p>
    {:else}
      <Loading />
    {/if}
  {:else if data}
    <div class="dialog">
      <div class="dialogName">{data[0]}</div>
      <div class="dialogContent"><p>{data[1]}</p></div>
    </div>
  {/if}
  <MobileBack />
</div>

<style>
  .content{
    position: relative;
    flex: 1;
    padding: 1em 1em 6em 1em;
    overflow: auto;
  }
  .image{
    width: 70%;
    margin: 0 auto;
    text-align: center;
    position: relative;
  }
  .image img{
    max-width: 100%;
    border-radius: 1em;
    overflow: hidden;
  }
  .image :global button{
    position: absolute;
    right: 1em;
    bottom: 1em;
  }
  .dialog{
    margin: .5em 0 1em;
    background: #fafafa;
    border-top: 1px solid white;
    border-radius: 10px;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
  }
  .dialog>.dialogContent{
    padding: .8em 1em 1em;
  }
  .dialogName{
    color: white;
    padding: .2em 1em .2em .5em;
    font-size: .9em;
    min-width: 11em;
    margin-top: .8em;
    position: relative;
    display: inline-block;
    background-color: #444;
  }
  .dialogName::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 1em solid transparent;
    border-bottom: 1em solid transparent;
    border-right: 7px solid #fafafa;
  }
</style>
