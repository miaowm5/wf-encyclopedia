
const storageKey = 'jukebox'

const getValue = (init = true)=>{
  try{
    let playList = JSON.parse(
      localStorage.getItem(storageKey) || `[]`
    )
    if (playList.length === 0 && init){ playList = ["common/encyclopedia.mp3"] }
    return playList
  }
  catch(e){
    console.error(e)
    return ["common/encyclopedia.mp3"]
  }
}

const init = (state)=>{
  const saveToStorage = ()=>{
    return
    localStorage.setItem(storageKey, JSON.stringify(state.jukebox.playList))
  }
  window.addEventListener('storage', (e)=>{
    if (e.key === 'jukebox'){ state.jukebox.playList = getValue(false) }
  })

  const add = (list)=>{
    state.jukebox.playList = state.jukebox.playList
      .filter((file)=>!list.includes(file))
      .concat(list)
    saveToStorage()
  }
  const remove = (list)=>{
    state.jukebox.playList = state.jukebox.playList.filter((file)=>{
      return !list.includes(file)
    })
    saveToStorage()
  }
  const clean = ()=>{
    state.jukebox.playList = []
    saveToStorage()
  }
  const play = (value=null)=>{
    state.jukebox.playing = true
    if (value !== null){ state.jukebox.current = value }
    else if (!state.jukebox.current){
      state.jukebox.current = state.jukebox.playList[0]
    }
  }
  const pause = (clean = false)=>{
    state.jukebox.playing = false
    if (clean){ state.jukebox.current = '' }
  }

  return {
    add, remove, clean, play, pause
  }
}

export default init
export { getValue }
