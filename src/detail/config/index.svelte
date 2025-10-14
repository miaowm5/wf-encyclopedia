<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  import { Title } from '../../ui'

  const backSprite = spriteSheet('res/icon', 'return')

</script>

{#snippet button(text, config, value)}
  <button
    class={['btn', store.state.config[config] === value && 'active']}
    onclick={()=>store.changeConfig(config, value)}>
    {text}
  </button>
{/snippet}

<div class="content">
  <button class="back" onclick={()=>{ store.route.push('/', true) }}>
    <img src={backSprite.src} alt={store.i18n("detail.content.configBack")}>
    {store.i18n("detail.content.configBack")}
  </button>
  <div class="main">
    <Title>{store.i18n("detail.content.config1")}</Title>
    <div class="btns">
      {@render button(store.i18n("detail.content.config1Value1"), 'dataRegion', 'cn')}
      {@render button(store.i18n("detail.content.config1Value2"), 'dataRegion', 'jp')}
    </div>
    <Title>{store.i18n("detail.content.config2")}</Title>
    <div class="btns">
      {@render button(store.i18n("detail.content.config2Value1"), 'language', 'cn')}
      {@render button(store.i18n("detail.content.config2Value2"), 'language', 'jp')}
      {@render button(store.i18n("detail.content.config2Value3"), 'language', 'en')}
    </div>
  </div>
</div>

<style>
  .content{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .back{
    display: inline-block;
    border: none;
    border-bottom: 1px solid #eaeaea;
    background: white;
    text-align: left;
    padding: .8em .8em .5em;
    box-shadow: none;
    font-size: .9em;
    position: relative;
    line-height: 1.5em;
  }
  .back :global img{
    height: 1.5em;
    margin-bottom: -.4em;
  }
  .main{
    flex: 1;
    overflow: auto;
    padding: 1em 1em 5em;
  }
  .btns{
    display: flex;
    flex-wrap: wrap;
    gap: .7em .5em;
    justify-content: center;
    margin: .5em auto 1em;

  }
  .btn{
    padding: .5em 2em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
  .btn.active{
    border-top: none;
    background-color: #ffcf8f;
  }

</style>
