
import { wrapApi } from '../common'

const cache = {}

const config = {
  equipment: {
    path: 'item/equipment',
    handler: (data)=>{ return data }
  },
  normal_quest: {
    path: 'quest/normal_quest',
    handler: (data)=>{
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
      return result
    }
  },
  extra_quest: {
    path: 'quest/extra_quest',
    handler: (data)=>{ return data }
  },
  character_quest: {
    path: 'quest/character_quest',
    handler: (data)=>{
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
      return result
    }
  },
  character_speech: {
    path: 'character/character_speech',
    handler: (data)=>{ return data }
  },
  character_speech_text: {
    path: 'character/voiceLine',
    handler: (data)=>{ return data }
  },
  encyclopedia: {
    path: 'encyclopedia/encyclopedia',
    handler: (data)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{
        pureData[key] = []
        Object.keys(data[key]).forEach((index)=>{
          let value = data[key][index][0]
          value[19] = value[19].split(',')
          value[20] = value[20].split('\n')
          pureData[key][index - 1] = value
        })
        pureData[key] = pureData[key].filter((item)=>item)
      })
      return pureData
    }
  },
  character: {
    path: 'character/character',
    handler: (data)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{ pureData[key] = data[key][0] })
      return pureData
    }
  },
  character_text: {
    path: 'character/character_text',
    handler: (data)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{ pureData[key] = data[key][0] })
      return pureData
    }
  },
  story_character: {
    path: 'story/story_character',
    handler: (data)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{
        const item = data[key][0]
        const emoName = item[3].split(',')
        const emoBack = item[4].split(',')
        const emoFront = item[5].split(',')
        const emotion = {}
        emoName.forEach((name, index)=>{
          emotion[name] = {
            back: (emoBack[index] || '(None)') === '(None)' ? null : emoBack[index],
            front: (emoFront[index] || '(None)') === '(None)' ? null : emoFront[index]
          }
        })
        item[3] = emotion
        pureData[key] = item
      })
      return pureData
    }
  },
}

const init = (state)=>{
  const load = (...db)=>{
    let finish = $state(false)
    let error = $state([])
    let database = $state({})
    let progress = 0

    const addProgress = ()=>{
      progress += 1
      if (progress >= db.length){
        db.forEach((name)=>{ database[name] = cache[name] })
        if (error.length === 0){ finish = true }
      }
    }

    db.forEach((name)=>{
      let loadConfig = config[name]
      if (cache[name]){ addProgress() }
      else{
        const baseUrl = {
          cn: `${import.meta.env.VITE_CDN3}/orderedmap/`,
          jp: `${import.meta.env.VITE_CDN3}/orderedmap2/`
        }[state.dataRegion] || `${import.meta.env.VITE_CDN3}/orderedmap/`
        wrapApi(`${baseUrl}${loadConfig.path}.json`, {
          success: (data)=>{
            cache[name] = loadConfig.handler(data, state.dataRegion)
            addProgress()
          },
          fail: (err)=>{
            console.error(err)
            error.push(`${name} load failed`)
          },
          cors: true
        }, true)
      }
    })

    return {
      get db(){ return database },
      get error(){ return error },
      get finish(){ return finish },
    }
  }
  return load
}

export default init
