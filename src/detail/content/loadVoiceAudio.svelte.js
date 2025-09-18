
import { Howl } from 'howler'
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
        after: ()=>{ promiseCache[url] = undefined }
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
      src: [`${import.meta.env.VITE_CDN2}voice/${character}.ogg`],
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
  let loadOver = $state(false)
  let playing = $state(null)

  const cleanupSound = ()=>{
    if (sound){ sound.unload() }
    cancelFunc = true
  }
  onDestroy(cleanupSound)

  const load = async ()=>{
    if (!character){ return }
    const config = await loadConfig()
    if (cancelFunc){ return }
    voiceData = config[character]
    if (!voiceData){ return }
    const sound = await loadHowl(`${character}?${config.timestamp || ''}`, voiceData)
    if (!sound){ return }
    if (cancelFunc){ return }
    sound.on('end', ()=>{ playing = null })
    sound.on('stop', ()=>{ playing = null })
    loadOver = true
  }
  load()

  return {
    get loadOver(){ return loadOver },
    get playing(){ return playing },
    get seek(){
      if (!sound || !playing){ return 0 }
      let current = sound.seek() || 0
      let offset = voiceData[1]
      let duration = voiceData[2]
      return ((current - offset / 1000) / duration) * 100
    },
    play(name){
      if (!sound){ return }
      const key = `${name}.mp3`
      if (!voiceData[key]){ return }
      sound.stop()
      sound.play(key)
      playing = [name, ...voiceData[key]]
    },
    destory(){ cleanupSound() },
  }
}

export default main
