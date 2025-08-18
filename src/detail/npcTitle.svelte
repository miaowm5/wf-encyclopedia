<script>
  const {
    name = '(None)',
    title = '(None)',
    element = '(None)',
    race = '(None)',
    gender = '(None)',
    cv = '(None)',
  } = $props()

  document.title = name + ' | ' + import.meta.env.VITE_SITE_NAME

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
</script>

<div class="character">
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
    color: white;
    padding: 2em 2em 3em;
    background: url(/resource/ui/keyword_details_character_background.png);
    background-size: cover;
    background-position: center bottom;
    line-height: 0;
  }
  .character>.info{
    line-height: 2em;
  }
  .character>.info>.name{
    font-size: 1.5em;
  }
</style>
