
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
    localStorage.setItem(storageKey, JSON.stringify(state.jukebox.playList))
  }
  window.addEventListener('storage', (e)=>{
    if (e.key === 'jukebox'){ state.jukebox.playList = getValue(false) }
  })

  const add = (list = [])=>{
    state.jukebox.playList = state.jukebox.playList
      .filter((file)=>!list.includes(file))
      .concat(list)
    saveToStorage()
  }
  const remove = (target = '')=>{
    state.jukebox.playList = state.jukebox.playList.filter((file)=>{
      return target !== file
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
  const setLoop = (value)=>{
    state.jukebox.loop = value
  }
  const setRandom = (value)=>{
    state.jukebox.random = value
  }

  return {
    add, remove, clean, play, pause, setLoop, setRandom
  }
}

export default init
export { getValue }
