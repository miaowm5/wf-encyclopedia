<script>
  import store from '../../store'
  import { RoundButton, Loading, Title } from '../../ui'
  import extraGallery from '../../database/extraGallery.json'
  import MobileBack from './mobileBack.svelte'

  const { item } = $props()
  const loadDB = store.database('equipment')

  const data = $derived.by(()=>{
    if (item.subType !== 'main'){ return null }
    if (!loadDB.finish){ return null }
    const database = loadDB.db.equipment
    if (!database){ return null }
    let chapter = item.storyID
    let result = database[100000 + (chapter - 0)]
    if (!result){ return null }
    return [result[1], result[5]]
  })

  const extarImage = extraGallery[item.eventID] || []

</script>

<div class="content">
  {#if item.subType === 'main'}
    {@const url = import.meta.env.VITE_CDN2 + `orb/chapter${item.storyID}.png`}
    <div class="image orb">
      <img src={url} alt={data ? data[0] : `${item.title}`} width="1080" height="1920" />
      <RoundButton icon="full_size" onclick={()=>window.open(url)} />
    </div>
    <Loading finish={loadDB.finish && data} error={loadDB.error}>
      <div class="dialog">
        <div class="dialogName">{data[0]}</div>
        <div class="dialogContent"><p>{data[1]}</p></div>
      </div>
    </Loading>
  {/if}
  {#if extarImage.length > 0}
    <Title>{store.i18n("detail.content.title12")}</Title>
    {#each extarImage as image}
      {@const url = import.meta.env.VITE_CDN2 + `gallery/${image}`}
      <div class="image gallery">
        <img src={url} alt={item.title} />
        <RoundButton icon="full_size" onclick={()=>window.open(url)} />
      </div>
    {/each}
  {/if}
  <MobileBack />
</div>

<style>
  .content{
    position: relative;
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
  }
  .image{
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
    position: relative;
    border-radius: 1em;
    overflow: hidden;
  }
  .image img{
    max-width: 100%;
    max-height: 100%;
    height: auto;
    width: auto;
    background-color: #444444;
    display: block;
  }
  .image :global button{
    position: absolute;
    right: 1em;
    bottom: 1em;
  }
  .image.orb{
    margin-top: 1em;
    width: 70%;
  }
  .image.gallery{
    max-height: 50vh;
    min-height: 4em;
    margin-bottom: 1em;
    position: relative;
    display: flex;
    background-color: #444444;
    justify-content: center;
  }
  .image.gallery img{
    object-fit: cover;
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
