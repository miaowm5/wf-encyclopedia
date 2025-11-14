<script>
  import store from '../../store'
  import playerLogic from './player.svelte.js'
  import FullPlayer from './fullPlayer.svelte'
  import MiniPlayer from './miniPlayer.svelte'

  const player = playerLogic()
  const current = $derived(store.state.jukebox.current)
  const playlist = $derived(store.state.jukebox.playList)
  const songName = $derived.by(()=>{
    let name = current || playlist[0] || ''
    if (!name){ return ['',''] }
    let parts = name.split('/')
    let file = parts.pop()
    return [file.slice(0, file.length - 4), parts.join('/')]
  })
</script>

{#if window.location.search === '?jukebox'}

{#if store.state.ui.jukeboxOpen}
  <FullPlayer player={player} songName={songName} />
{:else}
  <MiniPlayer songName={songName} />
{/if}

{/if}
