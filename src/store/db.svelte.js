
import { onDestroy } from "svelte"
import { api } from '../common'

const cache = {}

const config = {
  equipment: {
    path: 'item/equipment',
    handler: (data)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{ pureData[key] = data[key][0] })
      return pureData
    }
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
    handler: (data)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{
        pureData[key] = {}
        Object.keys(data[key]).forEach((id)=>{
          pureData[key][id] = data[key][id][0]
        })
      })
      return pureData
    }
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
    handler: (data, region)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{
        let item = Object.keys(data[key]).map((index)=>data[key][index][0])
        if (region === 'jp'){ item = item.map((v)=>[...v.slice(0, 3), '', ...v.slice(3)]) }
        const result = {
          type: 'normal',
          releated: [],
          desc: [],
          title: item[0][17],
        }
        if (item[0][4] === '0' || item[0][4] === '1'){
          result.type = 'character'
          result.characterID = item[0][5]
          result.storyID = item[0][6]
        }
        else if (item[0][4] === '2'){
          result.type = 'npc'
          result.storyID = item[0][6]
          result.headID = item[0][7]
          result.cv = item[0][9]
          result.race = item[0][10]
          result.gender = item[0][11]
        }
        else if (item[0][4] === '3' || item[0][4] === '4' || item[0][4] === '5'){
          result.type = 'story'
          if (item[0][4] === '3'){
            result.subType = 'main'
            result.storyID = item[0][12]
          }else if (item[0][4] === '4'){
            let storyType2 = item[0][13]
            if (storyType2 === '6'){
              result.subType = 'event-world'
            }else if (storyType2 === '2'){
              result.subType = 'event-single'
            }else if (storyType2 === '0'){
              result.subType = 'event-quest'
            }
            result.storyID = item[0][14]
          }
          else if (item[0][4] === '5'){ result.subType = 'prologue' }
          result.banner = item[0][16]
          result.eventID = item[0][1]
        }
        result.releated = item[0][19] ? item[0][19].split(',') : []
        result.desc = []
        item.forEach((block)=>{
          result.desc.push(block[20].split('\n'))
        })
        pureData[key] = result
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
    handler: (data, region)=>{
      const pureData = {}
      Object.keys(data).forEach((key)=>{
        pureData[key] = data[key][0]
        if (region === 'jp'){
          let v = pureData[key]
          pureData[key] = [...v.slice(0, 9), '', '', ...v.slice(9)]
        }
      })
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

const promiseCache = {}
const loadDB = async (cacheKey, url, handler, success, fail)=>{
  if (cache[cacheKey]){ success(); return }
  let promise = promiseCache[url]
  if (!promise){
    promise = new Promise((resolve, reject)=>{
      api(url, {
        success: (data)=>{
          cache[cacheKey] = handler(data)
          resolve()
        },
        fail: (err)=>{ console.error(err); reject(err) },
        after: ()=>{ promiseCache[url] = undefined },
        cors: true
      })
    })
    promiseCache[url] = promise
  }
  try{ await promise }catch(e){ fail(e); return }
  success()
}

const init = (state)=>{
  const load = (...db)=>{
    let finish = $state(false)
    let error = $state([])
    let database = $state({})
    let progress = $state(0)
    let cancelFunc = false
    onDestroy(()=>{ cancelFunc = true })

    const addProgress = ()=>{
      progress += 1
      if (progress >= db.length){
        db.forEach((name)=>{
          if (name){
            const cacheKey = `${state.config.dataRegion}-${name}`
            database[name] = cache[cacheKey]
          }
        })
        if (error.length === 0){ finish = true }
      }
    }

    const loadData = async ()=>{
      finish = false
      error = []
      database = {}
      progress = 0
      db.forEach((name)=>{
        if (!name){ return addProgress() }
        let loadConfig = config[name]
        const cdn = import.meta.env.VITE_CDN3
        const baseUrl = {
          cn: `${cdn}/orderedmap/`,
          jp: `${cdn}/orderedmap2/`
        }[state.config.dataRegion] || `${cdn}/orderedmap/`
        loadDB(
          `${state.config.dataRegion}-${name}`,
          `${baseUrl}${loadConfig.path}.json`,
          (data)=>{ return loadConfig.handler(data, state.config.dataRegion) },
          ()=>{ if (!cancelFunc){ addProgress() } },
          ()=>{ if (!cancelFunc){ error.push(`${name} load failed`) } },
        )
      })
    }
    loadData()

    let currentRegion = state.config.dataRegion
    $effect(()=>{
      if (currentRegion === state.config.dataRegion){ return }
      loadData()
      currentRegion = state.config.dataRegion
    })

    return {
      get db(){ return database },
      get error(){ return error },
      get finish(){ return finish },
      get progress(){
        if (db.length === 0){ return 100 }
        return Math.min(progress / db.length * 100, 100)
      }
    }
  }
  return load
}

export default init
