<script>
  import store from '../../store'
  import { MusicItem } from '../../ui'

  const { item } = $props()

  const fullPath = $derived(`${item.path}/${item.name}.mp3`)

  const isPlaying = $derived.by(()=>{
    return store.state.jukebox.current === fullPath && store.state.jukebox.playing
  })
  const isOnPlaylist = $derived.by(()=>{
    return store.state.jukebox.playList.some((i)=>i === fullPath)
  })
</script>

<MusicItem
  title={fullPath}
  play={store.jukebox.play}
  triggerList={(title)=>{
    if (isOnPlaylist){ store.jukebox.remove(title) }
    else{ store.jukebox.add([title]) }
  }}
  inlist={isOnPlaylist}
  active={isPlaying}
/>
