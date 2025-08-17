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
    {#if race !== '(None)'}<p>种族：{race}</p>{/if}
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
