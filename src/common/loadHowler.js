
import { Howl } from 'howler'

const loadHowl = async (src, sprite)=>{
  const sound = await new Promise((resolve)=>{
    const sound = new Howl({
      src: [src],
      sprite,
    })
    if (sound.state() === 'loaded'){ resolve(sound) }
    else{
      sound.on('load', ()=>{ resolve(sound) })
      sound.on('loaderror', ()=>{ resolve(null) })
    }
  })
  return sound
}
const loadSound = (music, callback, sprite = undefined)=>{
  let cancelFunc = false
  let sound = null
  const destory = ()=>{
    if (sound){ sound.unload() }
    cancelFunc = true
  }
  if (music){
    const load = async ()=>{
      const howler = await loadHowl(music, sprite)
      if (cancelFunc){
        if (howler){ howler.unload() }
        callback(null)
        return
      }
      sound = howler
      callback(howler)
    }
    load()
  }
  return { destory }
}

export default loadSound
