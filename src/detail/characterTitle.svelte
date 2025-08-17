<script>
  import store from '../store'
  import NpcTitle from './npcTitle.svelte'

  const { data } = $props()

  const database2 = store.state.database.character_text

  const character = $derived.by(()=>{
    const character = database2[data[0][5]]
    document.title = character[0] + ' | ' + import.meta.env.VITE_SITE_NAME
    return character
  })
</script>

<NpcTitle
  title={character[3]}
  name={character[0]}
  cv={character[11]}
  element='(None)'
  race='(None)'
  gender='(None)'
/>

<style>
</style>
