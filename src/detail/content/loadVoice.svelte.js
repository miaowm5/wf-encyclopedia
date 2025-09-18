
import store from '../../store'
import { wrapApi } from '../../common'

const main = ()=>{

  let finish = $state(false)
  let error = $state([])

  wrapApi(`/orderedmap/character/character_speech.json`, {
    before: ()=>{
      if (store.state.database.character_speech){
        finish = true
        return false
      }
    },
    success: (data)=>{
      store.setDatabase('character_speech', data)
      finish = true
    },
    fail: (err)=>{ error.push(`voice load failed`) }
  }, true)

  return {
    get error(){ return error },
    get finish(){ return finish }
  }
}

export default main
