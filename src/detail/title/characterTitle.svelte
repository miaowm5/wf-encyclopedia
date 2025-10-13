<script>
  import store from '../../store'
  import NpcTitle from './npcTitle.svelte'

  const { data, tab } = $props()

  const loadDB = store.database('character', 'character_text')

  const character = $derived.by(()=>{
    if (!loadDB.finish){ return [] }
    const database2 = loadDB.db.character_text
    const character = database2[data.characterID]
    document.title = character[0] + ' | ' + store.i18n('main.sitename')
    return character
  })

  const characterData = $derived.by(()=>{
    if (!loadDB.finish){ return null }
    const database3 = loadDB.db.character
    return database3[data.characterID]
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
