
import { Howl } from 'howler'
import { onDestroy } from 'svelte'
import { api } from '../../common'

let configCache = null
const promiseCache = {}

const loadConfig = async ()=>{
  if (configCache){ return configCache }
  const url = `${import.meta.env.VITE_CDN2}voice.json`
  let promise = promiseCache[url]
  if (!promise){
    promise = new Promise((resolve)=>{
      api(url, {
        success: (data)=>{ resolve(data) },
        fail: (err)=>{ console.error(err), resolve(null) },
        after: ()=>{ promiseCache[url] = undefined },
        cors: true,
      })
    })
    promiseCache[url] = promise
  }
  const result = await promise
  if (result){ configCache = result }
  return configCache
}
const loadHowl = async (character, config)=>{
  let promise = new Promise((resolve)=>{
    const sound = new Howl({
      src: [`${import.meta.env.VITE_CDN2}voice/${character}`],
      sprite: config
    })
    sound.on('load', ()=>{ resolve(sound) })
    sound.on('loaderror', ()=>{ resolve(null) })
  })
  const sound = await promise
  return sound
}

const main = (character)=>{
  let sound = null
  let voiceData = null
  let cancelFunc = false
  let playing = $state(null)
  let seek = $state(0)

  let updateSeekTimer = null
  const updateSeek = ()=>{
    if (playing){
      let current = sound.seek() || 0
      let offset = playing[1]
      let duration = playing[2]
      seek = Math.max(0, Math.min(100, ((current * 1000 - offset) / duration ) * 100))
      updateSeekTimer = requestAnimationFrame(updateSeek, 10)
    }else{
      seek = 0
    }
  }
  const cleanupSound = ()=>{
    if (sound){ sound.unload() }
    if (updateSeekTimer){ cancelAnimationFrame(updateSeekTimer) }
    cancelFunc = true
  }
  onDestroy(cleanupSound)

  const play = (name)=>{
    if (!voiceData[name]){ return }
    sound.stop()
    sound.play(name)
    setTimeout(()=>{
      playing = [name, ...voiceData[name]]
      updateSeek()
    }, 1)
  }

  const load = async ()=>{
    if (!character){ return }
    const config = await loadConfig()
    if (cancelFunc){ return }
    if (!config){ return }
    voiceData = config[character]
    if (!voiceData){
      console.log(character)
      playing = null
      return
    }
    sound = await loadHowl(`${character}.ogg?${config.timestamp || ''}`, voiceData)
    if (cancelFunc){ return }
    if (!sound){ playing = null; return }
    sound.on('end', ()=>{ playing = null; seek = 0 })
    sound.on('stop', ()=>{ playing = null; seek = 0 })
    if (playing){ play(playing[0]) }
  }
  load()

  return {
    get playing(){ return playing },
    get seek(){ return seek },
    play(name){
      if (!sound){ playing = [name]; return }
      play(name)
    },
    destory: cleanupSound,
  }
}

export default main
