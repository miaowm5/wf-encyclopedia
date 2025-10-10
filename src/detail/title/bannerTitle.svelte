<script>
  import store from '../../store'
  import { RoundButton } from '../../ui'
  const { data, title, tab, gallery = false } = $props()
  const url = $derived.by(()=>{
    return data.replace('encyclopedia/', import.meta.env.VITE_CDN) + '.png'
  })
  document.title = title + ' | ' + store.i18n('main.sitename')
</script>

<div class="header" style:background-image={`url(${url})`}>
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
</style>
