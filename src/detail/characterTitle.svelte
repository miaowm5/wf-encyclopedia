<script>
  import store from '../store'
  import NpcTitle from './npcTitle.svelte'

  const { data } = $props()

  const database2 = store.state.database.character_text
  const database3 = store.state.database.character

  const character = $derived.by(()=>{
    const character = database2[data[0][5]]
    document.title = character[0] + ' | ' + import.meta.env.VITE_SITE_NAME
    return character
  })

  const characterData = $derived.by(()=>{
    return database3[data[0][5]]
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
    banner={characterData[0]}
  />
{:else}
  <NpcTitle
    title={character[3]}
    name={character[0]}
    cv={character[11]}
    element='(None)'
    race='(None)'
    gender='(None)'
  />
{/if}
