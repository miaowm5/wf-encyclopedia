<script>
  import { spriteSheet } from '../common'

  const {
    name = '(None)',
    title = '(None)',
    element = '(None)',
    race = '(None)',
    gender = '(None)',
    cv = '(None)',
    banner = '(None)',
  } = $props()

  document.title = name + ' | ' + import.meta.env.VITE_SITE_NAME

  let bannerImage = $derived.by(()=>{
    return spriteSheet('character/banner', banner === '(None)' ? null : banner)
  })

  const genderText = $derived.by(()=>{
    if (gender === 'Female'){ return '女性' }
    if (gender === 'Male'){ return '男性' }
    if (gender === 'Ririi'){ return '莉莉' }
    if (gender === 'Unknown'){ return '不明' }
    return '(None)'
  })

  const raceText = $derived.by(()=>{
    if (race === '(None)'){ return race }
    return race.split(',').map((item)=>{
      if (item === 'Human'){ return '人' }
      if (item === 'Element'){ return '精灵' }
      if (item === 'Devil'){ return '魔' }
      if (item === 'Beast'){ return '兽' }
      if (item === 'Machine'){ return '机械' }
      if (item === 'Mystery'){ return '妖' }
      if (item === 'Dragon'){ return '龙' }
      if (item === 'Undead'){ return '不死' }
      if (item === 'Aquatic'){ return '水棲' }
      if (item === 'Plants'){ return '植物' }
      return item
    })
  })

  const background = import.meta.env.VITE_CDN + 'ui/keyword_details_character_background.png'
</script>

<div class="character" style:background-image={`url(${background})`}>
  <img src={bannerImage.src} alt="banner" class="banner">
  <div class="info">
    {#if title !== '(None)'}<p>
      {#if element !== '(None)'}
        <!-- element icon -->
      {/if}
      {title}
    </p>{/if}
    <p class="name">{name}</p>
    {#if raceText !== '(None)'}<p>种族：{raceText.join('/')}</p>{/if}
    {#if gender !== '(None)'}<p>性别：{genderText}</p>{/if}
    {#if cv !== '(None)'}<p>CV：{cv}</p>{/if}
  </div>
</div>

<style>
  .character{
    flex: 0;
    color: white;
    padding: 2em 2em 3em;
    background-size: cover;
    background-position: center bottom;
    line-height: 0;
    position: relative;
    font-size: .9em;
  }
  .character>.info{
    line-height: 1.7em;
  }
  .character>.info>.name{
    font-size: 1.5em;
    line-height: 2em;
  }
  .banner{
    height: 100%;
    right: 0;
    bottom: 0;
    max-height: 215px;
    position: absolute;
  }
</style>
