
import { onDestroy } from 'svelte'
import { loadHowler } from '../../common'
import playListLogic from './playlist.svelte'
import store from '../../store'

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
  let initSeek = 0
  const changeSeek = (value)=>{
    if (!sound){ initSeek = value; return }
    const duration = sound.duration()
    sound.seek(Math.max(0, Math.min(duration, value * duration)))
    initSeek = 0
  }

  let cancelFunc = false
  let sound = null
  let currentPlay = $state(null)
  let howler = loadHowler(null)
  $effect(()=>{
    if (!playing){ return }
    if (currentPlay === current){ return }
    howler.destory()
    sound = null
    currentPlay = current
    seek = 0
    if (!currentPlay){ return }
    howler = loadHowler(`${import.meta.env.VITE_CDN4}${current}`, (howl)=>{
      if (cancelFunc || !howl){ return }
      sound = howl
      sound.on('play', ()=>{ registerSeek(true) })
      sound.on('pause', ()=>{ registerSeek(false) })
      sound.on('stop', ()=>{ registerSeek(false) })
      sound.on('end', ()=>{
        howler.destory()
        sound = null
        seek = 0
        registerSeek(false)
        setTimeout(()=>{
          playList.playNext()
          currentPlay = null
        }, 1)
      })
      if (playing){ sound.play() }
      if (initSeek){ changeSeek(initSeek) }
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
    howler.destory()
    if (updateSeekTimer){ cancelAnimationFrame(updateSeekTimer) }
    cancelFunc = true
  })
  return {
    get seek(){ return seek },
    setSeek(value){ changeSeek(value) },
  }
}

const main = ()=>{
  const playList = playListLogic()
  const player = playerLogic(playList)

  return {
    nextSong: playList.nextSong,
    lastSong: playList.lastSong,
    get seek(){ return player.seek },
    setSeek(value){ player.setSeek(value) },
  }
}

export default main
