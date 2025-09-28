<script>
  import store from '../../store'
  import NpcTitle from './npcTitle.svelte'

  const { data, tab } = $props()

  const database2 = store.state.database.character_text
  const database3 = store.state.database.character

  const character = $derived.by(()=>{
    const character = database2[data[0][5]]
    document.title = character[0] + ' | ' + store.i18n('main.sitename')
    return character
  })

  const characterData = $derived.by(()=>{
    return database3[data[0][5]]
  })

  const bannerID = $derived.by(()=>{
    if (!characterData){ return null }
    const id = characterData[0]
    if (id === 'stella_2anv'){ return 'stella' }
    return id
  })

</script>

{#if characterData}
  <NpcTitle
    title={character[3]}
    name={character[0]}
    cv={character[11]}
    element={characterData[3]}
    race={characterData[4]}
    gender={characterData[7]}
    banner={bannerID}
    tab={tab}
    rarity={characterData[2]}
    itemType='character'
  />
{:else}
  <NpcTitle
    title={character[3]}
    name={character[0]}
    cv={character[11]}
    element='(None)'
    race='(None)'
    gender='(None)'
    tab={tab}
    rarity='(None)'
    itemType='character'
  />
{/if}
