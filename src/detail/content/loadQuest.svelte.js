
import store from '../../store'
import { wrapApi } from '../../common'

const main = ()=>{

  let finish = $state(false)
  let error = $state([])

  wrapApi(`${import.meta.env.VITE_CDN3}/orderedmap/quest/character_quest.json`, {
    before: ()=>{
      if (store.state.database.character_quest){
        finish = true
        return false
      }
    },
    success: (data)=>{
      const result = {}
      Object.keys(data).forEach((key)=>{
        const item = data[key][0]
        const id = item[0]
        const title = item[3]
        const desc = item[123]
        const path = item[126]
        result[id] = result[id] || []
        result[id].push({ title, desc, path })
      })
      store.setDatabase('character_quest', result)
      finish = true
    },
    fail: (err)=>{ error.push(`quest load failed`) },
    cors: true
  }, true)

  return {
    get error(){ return error },
    get finish(){ return finish }
  }
}

export default main
