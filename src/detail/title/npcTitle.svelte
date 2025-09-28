<script>
  import { characterShot } from '../../common'
  import store from '../../store'
  import { SpriteLoader } from '../../ui'

  const {
    name = '(None)',
    title = '(None)',
    element = '(None)',
    race = '(None)',
    gender = '(None)',
    cv = '(None)',
    banner = '(None)',
    rarity = '(None)',
    itemType = 'npc',
    tab = 'info',
  } = $props()

  const database = store.state.database.story_character

  document.title = name + ' | ' + store.i18n('main.sitename')

  let bannerImage = $derived.by(()=>{
    if (!database[banner]){ return null }
    let emotion = Object.keys(database[banner][3])
    if (emotion.length === 0){ return null }
    return characterShot(database[banner][3][emotion[0]].back, database[banner][3][emotion[0]].front)
  })

  const genderText = $derived.by(()=>{
    if (gender === 'Female'){ return store.i18n("detail.title.sex1") }
    if (gender === 'Male'){ return store.i18n("detail.title.sex2") }
    if (gender === 'Ririi'){ return store.i18n("detail.title.sex3") }
    if (gender === 'Unknown'){ return store.i18n("detail.title.sex4") }
    return '(None)'
  })

  const raceText = $derived.by(()=>{
    if (race === '(None)'){ return race }
    let list = race.split(',').map((item)=>{
      if (item === 'Human'){ return [store.i18n("detail.title.race1"), 'race_human_medium'] }
      if (item === 'Element'){ return [store.i18n("detail.title.race2"), 'race_element_medium'] }
      if (item === 'Devil'){ return [store.i18n("detail.title.race3"), 'race_devil_medium'] }
      if (item === 'Beast'){ return [store.i18n("detail.title.race4"), 'race_beast_medium'] }
      if (item === 'Machine'){ return [store.i18n("detail.title.race5"), 'race_machine_medium'] }
      if (item === 'Mystery'){ return [store.i18n("detail.title.race6"), 'race_mystery_medium'] }
      if (item === 'Dragon'){ return [store.i18n("detail.title.race7"), 'race_dragon_medium'] }
      if (item === 'Undead'){ return [store.i18n("detail.title.race8"), 'race_undead_medium'] }
      if (item === 'Aquatic'){ return [store.i18n("detail.title.race9"), 'race_aquatic_medium'] }
      if (item === 'Plants'){ return [store.i18n("detail.title.race10"), 'race_plants_medium'] }
      return [item, 'race_human_medium2']
    })
    return list
  })

  const background = import.meta.env.VITE_CDN + 'ui/keyword_details_character_background.png'

  const buttonImage = {
    'info': 'encyclopedia',
    'gallery': 'full_size',
    'voice': 'voice_volume3',
    'story': 'character_story_mini',
  }

  const elementImage = $derived.by(()=>{
    if (element === '(None)'){ return null }
    const value = {
      '0': 'element_red_medium',
      '1': 'element_blue_medium',
      '2': 'element_yellow_medium',
      '3': 'element_green_medium',
      '4': 'element_white_medium',
      '5': 'element_black_medium',
    }[element]
    if (!value){ return null }
    return value
  })
</script>

{#snippet tabButton(type)}
  <button
    aria-label={type}
    style:background-image={`url(${import.meta.env.VITE_CDN}ui/icon/${buttonImage[type]}.png?082701)`}
    class={tab === type ? 'active' : null}
    onclick={()=>store.changeTab(type)}>
  </button>
{/snippet}

<div class="character" style:background-image={`url(${background})`}>
  {#if bannerImage && bannerImage.src}
    <div style:background-image={`url(${bannerImage.src})`} class="banner"></div>
  {/if}
  <div class="info">
    {#if title !== '(None)'}<p>
      {#if elementImage}
        <span class="element">
          <SpriteLoader spritesheet="res/icon" file={elementImage} alt={element} />
        </span>
      {/if}
      {title}
    </p>{/if}
    <p class="name">{name}</p>
    {#if raceText !== '(None)'}
      <p>{store.i18n("detail.title.raceTitle")}
        {#each raceText as item}
          <span class="race">
            {item[0]}
            <SpriteLoader spritesheet="res/icon" file={item[1]} alt={item[0]} />
          </span>
        {/each}
      </p>
    {/if}
    {#if gender !== '(None)'}<p>{store.i18n("detail.title.sexTitle")}{genderText}</p>{/if}
    {#if cv !== '(None)'}<p class="cv">{store.i18n("detail.title.cvTitle")}{cv}</p>{/if}
  </div>
  <div class="buttonGroup">
    {@render tabButton('info')}
    {@render tabButton('gallery')}
    {#if itemType === 'character' }
      {@render tabButton('voice')}
      {#if (rarity === '3' || rarity === '4' || rarity === '5')}
        {@render tabButton('story')}
      {/if}
    {/if}
  </div>
</div>

<style>
  .character{
    flex: 0;
    color: white;
    padding: 1.7em 2em 2em;
    background-color: black;
    background-size: cover;
    background-position: center bottom;
    position: relative;
    font-size: .95em;
  }
  .character>.info{
    z-index: 10;
    position: relative;
    text-shadow: 0 0 10px black;
  }
  .element :global > img{
    height: 1.2em;
    margin-bottom: -.2em;
    margin-right: .2em;
  }
  .name{
    font-size: 2em;
    margin-bottom: .3em;
  }
  .race :global >img{
    height: 1em;
    margin-left: .2em;
    margin-bottom: -.1em;
  }
  .race:not(:last-child):after{
    content: '/';
    margin-left: .8em;
    margin-right: .4em;
  }
  .cv{
    margin-top: .3em;
  }
  .banner{
    width: 95%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    background-repeat: no-repeat;
    background-position: top right;
    background-size: auto 115%;
  }
  .buttonGroup{
    right: 5%;
    bottom: .8em;
    position: absolute;
    z-index: 10;
  }
  .buttonGroup>button{
    border-radius: 50%;
    background-position: center center;
    width: 2.3em;
    height: 2.3em;
    margin-left: .3em;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border: 3px solid #fafafa;
  }
  .buttonGroup>button.active{
    border: 3px solid #fdff00;
    box-shadow:
      0 0 5px 0px rgba(0,0,0,0.5),
      0 0 8px 3px #fdff00;
    cursor: default;
  }
  @media (max-width: 430px) {
    .banner{
      height: 95%;
      top: 5%;
    }
  }
</style>
