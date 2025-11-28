
import store from '../../store'

let listCache = []
const addPlaycache = (music)=>{
  if (!music){ return }
  listCache = listCache.filter(item => item !== music)
  listCache.unshift(music)
}
const getRandomSong = (list=[])=>{
  if (!list || list.length === 0) { return 0 }
  const banCount = Math.floor(list.length / 2)
  const recent = listCache.slice(0, banCount)
  const allowed = []
  list.forEach((item, idx)=>{ if (!recent.includes(item)) { allowed.push(idx) } })
  if (allowed.length === 0){ return Math.floor(Math.random() * list.length) }
  return allowed[Math.floor(Math.random() * allowed.length)]
}

const playListLogic = ()=>{
  const list = $derived(store.state.jukebox.playList)
  const loop = $derived(store.state.jukebox.loop)
  const random = $derived(store.state.jukebox.random)
  const current = $derived(store.state.jukebox.current)

  let lastPlay = null
  $effect(()=>{
    if (lastPlay === current){ return }
    lastPlay = current
    addPlaycache(current)
  })

  const lastSong = ()=>{
    if (list.length === 0){ return }
    let index = list.indexOf(current)
    const nextIndex = index < 0 ? 0 : (index + list.length - 1) % list.length
    store.jukebox.play(list[nextIndex])
  }
  const nextSong = ()=>{
    if (list.length === 0){ return }
    let nextIndex = 0
    if (random && list.length > 2){
      nextIndex = getRandomSong(list)
    }else{
      let index = list.indexOf(current)
      nextIndex = index < 0 ? 0 : (index + 1) % list.length
    }
    store.jukebox.play(list[nextIndex])
  }
  return {
    lastSong,
    nextSong,
    playNext(){
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
