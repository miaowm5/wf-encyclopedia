
import store from '../../store'
import { wrapApi } from '../../common'

const main = ()=>{

  let finish = $state(false)
  let error = $state([])
  let progress = 0

  const addProgress = ()=>{
    progress += 1
    if (progress >= 1){ finish = true }
  }

  wrapApi(`${import.meta.env.VITE_CDN3}/orderedmap/item/equipment.json`, {
    before: ()=>{
      if (store.state.database.equipment){
        addProgress()
        return false
      }
    },
    success: (data)=>{
      store.setDatabase('equipment', data)
      addProgress()
    },
    fail: (err)=>{ error.push(`equipment load failed`) },
    cors: true
  }, true)

  return {
    get error(){ return error },
    get finish(){ return finish }
  }
}

export default main
