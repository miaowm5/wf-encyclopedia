<script>
  import store from '../../store'
  import { RoundButton } from '../../ui'
  const { data, title, tab } = $props()
  const url = $derived.by(()=>{
    return data.replace('encyclopedia/', import.meta.env.VITE_CDN) + '.png'
  })
  document.title = title + ' | ' + store.i18n('main.sitename')
</script>

<div class="header" style:background-image={`url(${url})`}>
  <div class="buttonGroup">
    <RoundButton
      icon="encyclopedia"
      alt="info"
      onclick={()=>store.changeTab('info')}
      active={tab === 'info'}
    />
    <RoundButton
      icon="character_story_mini"
      alt="story"
      onclick={()=>store.changeTab('story')}
      active={tab === 'story'}
    />
  </div>
</div>

<style>
  .header {
    flex: 1;
    background-color: black;
    background-size: cover;
    background-position: center 80%;
    width: 100%;
    max-height: 20%;
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
