
import { onDestroy } from 'svelte'
import { api, loadHowler } from '../../common'

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

const main = (character)=>{
  let sound = null
  let howler = null
  let voiceData = null
  let cancelFunc = false
  let playing = $state(null)
  let seek = $state(0)
  let loadOver = $state(false)

  let updateSeekTimer = null
  const updateSeek = ()=>{
    if (playing){
      let current = sound.seek() || 0
      let offset = playing[1]
      let duration = playing[2]
      let value = Math.max(0, Math.min(100, ((current * 1000 - offset) / duration ) * 100))
      if (value < 100){ seek = value }
      updateSeekTimer = requestAnimationFrame(updateSeek)
    }else{
      seek = 0
    }
  }
  const cleanupSound = ()=>{
    if (howler){ howler.destory() }
    if (updateSeekTimer){ cancelAnimationFrame(updateSeekTimer) }
    cancelFunc = true
  }
  onDestroy(cleanupSound)

  const play = (name)=>{
    if (!sound || !voiceData[name]){ return }
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
      loadOver = true
      return
    }
    sound = await new Promise((resolve)=>{
      const url = `${import.meta.env.VITE_CDN2}voice/${character}.ogg?${config.timestamp || ''}`
      howler = loadHowler(url, resolve, voiceData)
    })
    if (cancelFunc){ return }
    if (!sound){ playing = null; loadOver = true; return }
    sound.on('end', ()=>{ playing = null; seek = 0 })
    sound.on('stop', ()=>{ playing = null; seek = 0 })
    if (playing){ play(playing[0]) }
    loadOver = true
  }
  load()

  return {
    get playing(){ return playing },
    get seek(){ return seek },
    play(name){
      if (!loadOver){ playing = [name]; return }
      play(name)
    },
    destory: cleanupSound,
  }
}

export default main
