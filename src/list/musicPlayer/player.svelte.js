
import { Howl } from 'howler'
import { onDestroy } from 'svelte'
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

const loadHowl = async (path, callback)=>{
  const src = `${import.meta.env.VITE_CDN4}${path}`
  let promise = new Promise((resolve)=>{
    const sound = new Howl({ src: [src] })
    sound.on('load', ()=>{ resolve(sound) })
    sound.on('loaderror', ()=>{ resolve(null) })
  })
  const sound = await promise
  callback(sound)
}
const playerLogic = (playList)=>{

  let current = $derived(store.state.jukebox.current)
  let playing = $derived(store.state.jukebox.playing)

  let seek = $state(0)
  let updateSeekTimer = null
  const getSoundSeek = ()=>{
    if (!sound){ return 0 }
    let current = sound.seek() || 0
    let duration = sound.duration()
    let value = Math.max(0, Math.min(100, ((current) / duration ) * 100))
    return value
  }
  const updateSeek = ()=>{
    updateSeekTimer = requestAnimationFrame(updateSeek)
    seek = getSoundSeek()
  }
  const registerSeek = (register = true)=>{
    if (updateSeekTimer){ cancelAnimationFrame(updateSeekTimer) }
    if (register){ updateSeek() }
  }

  let cancelFunc = false
  let sound = null
  let currentPlay = $state(null)
  $effect(()=>{
    if (!playing){ return }
    if (currentPlay === current){ return }
    if (sound){ sound.unload() }
    sound = null
    currentPlay = current
    if (!currentPlay){ return }
    loadHowl(currentPlay, (howler)=>{
      if (cancelFunc){ return }
      if (!howler){ return }
      sound = howler
      sound.on('play', ()=>{ registerSeek(true) })
      sound.on('pause', ()=>{ registerSeek(false) })
      sound.on('stop', ()=>{ registerSeek(false) })
      sound.on('end', ()=>{
        sound.unload()
        sound = null
        seek = 0
        registerSeek(false)
        setTimeout(()=>{
          playList.playNext()
          currentPlay = null
        }, 1)
      })
      if (playing){ sound.play() }
    })
  })
  $effect(()=>{
    if (playing){
      if (!sound){ return }
      sound.play()
    }else{
      if (!sound){ return }
      sound.pause()
    }
  })
  onDestroy(()=>{
    if (sound){ sound.unload() }
    if (updateSeekTimer){ cancelAnimationFrame(updateSeekTimer) }
    cancelFunc = true
  })
  return {
    get seek(){ return seek }
  }
}

const main = ()=>{
  const playList = playListLogic()
  const player = playerLogic(playList)

  return {
    nextSong: playList.nextSong,
    lastSong: playList.lastSong,
    get seek(){ return player.seek },
  }
}

export default main
