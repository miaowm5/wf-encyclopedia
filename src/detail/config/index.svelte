<script>
  import store from '../../store'
  import { spriteSheet } from '../../common'
  import { Title } from '../../ui'

  const backSprite = spriteSheet('res/icon', 'return')

  const closeConfig = ()=>{
    if (store.state.item){ history.go(-1) }
    else if (store.state.ui.listCategory){ history.go(-1) }
    else{ store.route.push('/', true) }
  }
</script>

{#snippet button(text, config, value)}
  <button
    class={['btn', store.state.config[config] === value && 'active']}
    onclick={()=>store.changeConfig(config, value)}>
    {text}
  </button>
{/snippet}

<div class="content">
  <button class="back" onclick={closeConfig}>
    <img src={backSprite.src} alt={store.i18n("detail.config.configBack")}>
    {store.i18n("detail.config.configBack")}
  </button>
  <div class="main">
    <Title>{store.i18n("detail.config.config3")}</Title>
    <div class="desc">{#each store.i18n("detail.config.config3Value").split('\n') as line}
      <p>{line}</p>
    {/each}</div>
    <div class="link">
      <a href="https://github.com/miaowm5/wf-encyclopedia/issues" target="_blank" rel="noopener noreferrer">{store.i18n("detail.config.config3Value1")}</a>
      <a href="https://worldflipper.jp/" target="_blank" rel="noopener noreferrer">ワールドフリッパー公式サイト</a>
    </div>
    <Title>{store.i18n("detail.config.config1")}</Title>
    <div class="btns">
      {@render button(store.i18n("detail.config.config1Value1"), 'dataRegion', 'cn')}
      {@render button(store.i18n("detail.config.config1Value2"), 'dataRegion', 'jp')}
    </div>
    <Title>{store.i18n("detail.config.config2")}</Title>
    <div class="btns">
      {@render button(store.i18n("detail.config.config2Value1"), 'language', 'cn')}
      {@render button(store.i18n("detail.config.config2Value2"), 'language', 'jp')}
      {@render button(store.i18n("detail.config.config2Value3"), 'language', 'en')}
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
  .desc{
    display: block;
    margin-bottom: .5em;
    border-radius: 10px;
    padding: 1em;
    background-color: white;
  }
  .desc>p{
    min-height: 1em;
  }
  .link > a{
    background: #fafafa;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
    cursor: pointer;
    color: #444444;
    text-decoration: none;
    display: block;
    padding: .5em 1em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-bottom: .5em
  }
</style>
