<script>
  import Related1 from './related1.svelte'
  import Related2 from './related2.svelte'
  import Title from './title.svelte'

  const { item, store } = $props()

</script>

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

<style>
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
  .item>p{
    min-height: 1em;
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
  }
</style>
