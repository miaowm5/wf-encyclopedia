
import store from '../../store'
import { wrapApi } from '../../common'

const main = ()=>{

  let finish = $state(false)
  let error = $state([])
  let progress = 0

  const addProgress = ()=>{
    progress += 1
    if (progress >= 2){ finish = true }
  }

  wrapApi(`${import.meta.env.VITE_CDN3}/orderedmap/character/character_speech.json`, {
    before: ()=>{
      if (store.state.database.character_speech){
        addProgress()
        return false
      }
    },
    success: (data)=>{
      store.setDatabase('character_speech', data)
      addProgress()
    },
    fail: (err)=>{ error.push(`voice load failed`) },
    cors: true
  }, true)

  wrapApi(`${import.meta.env.VITE_CDN3}/orderedmap/character/voiceLine.json`, {
    before: ()=>{
      if (store.state.database.character_speech_text){
        addProgress()
        return false
      }
    },
    success: (data)=>{
      store.setDatabase('character_speech_text', data)
      addProgress()
    },
    fail: (err)=>{ error.push(`voice line load failed`) },
    cors: true
  }, true)

  return {
    get error(){ return error },
    get finish(){ return finish }
  }
}

export default main
