
import store from '../../store'

const playListLogic = ()=>{
  const list = $derived(store.state.jukebox.playList)
  const loop = $derived(store.state.jukebox.loop)

  const lastSong = ()=>{
    if (list.length === 0){ return }
    let current = store.state.jukebox.current
    let index = list.indexOf(current)
    const nextIndex = index < 0 ? 0 : (index + list.length - 1) % list.length
    store.jukebox.play(list[nextIndex])
  }
  const nextSong = ()=>{
    if (list.length === 0){ return }
    let current = store.state.jukebox.current
    let index = list.indexOf(current)
    const nextIndex = index < 0 ? 0 : (index + 1) % list.length
    store.jukebox.play(list[nextIndex])
  }
  return {
    lastSong,
    nextSong,
    playNext(){
      let current = store.state.jukebox.current
      if (loop){
        store.jukebox.play(current)
        return
      }
      if (list.length === 0){
        store.jukebox.pause(true)
        return
      }
      nextSong()
    }
  }
}

export default playListLogic
