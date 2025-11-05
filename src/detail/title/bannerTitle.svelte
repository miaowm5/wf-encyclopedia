<script>
  import store from '../../store'
  import { RoundButton } from '../../ui'
  const { data, title, tab, gallery = false, extra } = $props()
  const url = $derived.by(()=>{
    if (extra){ return import.meta.env.VITE_CDN + 'ui/keyword_details_keyword_background' }
    return data.replace('encyclopedia/header_background',
      import.meta.env.VITE_CDN2 + {
        cn: `header_background`,
        jp: 'header_background_jp'
      }[store.state.config.dataRegion] || `header_background`
    )
  })
  document.title = title + ' | ' + store.i18n('main.sitename')
</script>

<div class="header" style:background-image={`url(${url}.png)`}>
  {#if extra}<p class="title">{title}</p>{/if}
  <div class="buttonGroup">
    {#snippet tabButton(type, icon)}
      <RoundButton
        icon={icon}
        alt={type}
        onclick={()=>store.changeTab(type)}
        active={tab === type}
      />
    {/snippet}
    {@render tabButton('info', 'encyclopedia')}
    {@render tabButton('story', 'character_story_mini')}
    {#if gallery}{@render tabButton('gallery', 'user_account_center')}{/if}
  </div>
</div>

<style>
  .header {
    flex: 1;
    background-color: black;
    background-size: cover;
    background-position: center 100%;
    width: 100%;
    max-height: 25%;
    position: relative;
  }
  .buttonGroup{
    right: 5%;
    bottom: .9em;
    position: absolute;
    z-index: 10;
    display: flex;
    gap: 0 .2em;
  }
  .title{
    margin-top: 2.5em;
    padding: 0 .5em;
    text-align: center;
    color: white;
    font-size: 1.5em;
  }
</style>
