
import store from '../../store'
import { wrapApi } from '../../common'

const main = (itemType)=>{

  let finish = $state(false)
  let error = $state([])

  if (itemType === 'story'){
    wrapApi(`${import.meta.env.VITE_CDN3}orderedmap/quest/normal_quest.json`, {
      before: ()=>{
        if (store.state.database.normal_quest){
          finish = true
          return false
        }
      },
      success: (data)=>{
        const result = {}
        Object.keys(data).forEach((type)=>{
          result[type] = {}
          Object.keys(data[type]).forEach((id)=>{
            data[type][id].forEach((item)=>{
              const title = item[0]
              const desc = item[1]
              const path = item[4]
              result[type][id] = result[type][id] || []
              result[type][id].push({ title, desc, path })
            })
          })
        })
        store.setDatabase('normal_quest', result)
        finish = true
      },
      fail: (err)=>{
        console.error(err)
        error.push(`quest load failed`) },
      cors: true
    }, true)
  }else{
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
  }
  return {
    get error(){ return error },
    get finish(){ return finish }
  }
}

export default main
