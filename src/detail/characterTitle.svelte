<script>
  import store from '../store'
  import NpcTitle from './npcTitle.svelte'
  import { wrapApi } from '../common'

  const { data } = $props()

  const database2 = store.state.database.character_text

  const character = $derived.by(()=>{
    const character = database2[data[0][5]]
    document.title = character[0] + ' | ' + import.meta.env.VITE_SITE_NAME
    return character
  })

  let loadDBState = $state(false)
  wrapApi(`/orderedmap/character/character.json`, {
    before: ()=>{
      if (store.state.database.character){
        loadDBState = true
        return false
      }
    },
    success: (data)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{ pureData[key] = data[key][0] })
      store.setDatabase('character', pureData)
      loadDBState = true
    }
  }, true)
  const characterData = $derived.by(()=>{
    if (!loadDBState) return null
    return store.state.database.character[data[0][5]]
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

<style>
</style>
