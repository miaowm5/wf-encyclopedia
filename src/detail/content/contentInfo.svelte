<script>
  import Related1 from './related1.svelte'
  import Related2 from './related2.svelte'
  import { Title } from '../../ui'
  import MobileBack from './mobileBack.svelte'

  const { item } = $props()

</script>

<div class="content">
  <section>
    <Title>{store.i18n("detail.content.title1")}</Title>
    {#each item as block}
      <div class="item">
        {#each block[20] as line}<p>{line}</p>{/each}
      </div>
    {/each}
  </section>
  <section><Related1 data={item[0][19]} /></section>
  <section><Related2 data={item[0][19]} /></section>
  <MobileBack />
</div>

<style>
  section{
    margin-top: .5em;
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
  .item>p{
    min-height: 1em;
  }
</style>
