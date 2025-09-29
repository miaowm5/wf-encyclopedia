
import store from './store'
import { wrapApi } from './common'

const main = ()=>{

  let finish = $state(false)
  let error = $state([])
  let progress = 0

  const refreshProgress = ()=>{
    progress += 1
    if (progress >= 4){ finish = true }
  }

  const loadDB = (tag, url, handle)=>{
    wrapApi(`${import.meta.env.VITE_CDN3}/orderedmap/${url}`, {
      before: ()=>{
        if (store.state.database[tag]){
          refreshProgress()
          return false
        }
      },
      success: (data)=>{
        store.setDatabase(tag, handle(data))
        refreshProgress()
      },
      fail: (err)=>{ error.push(`${tag} load failed`) },
      cors: true
    }, true)
  }

  loadDB('encyclopedia', 'encyclopedia/encyclopedia.json', (data)=>{
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
  })
  loadDB('character', 'character/character.json', (data)=>{
    const pureData = {}
    Object.keys(data).forEach((key)=>{ pureData[key] = data[key][0] })
    return pureData
  })
  loadDB('character_text', 'character/character_text.json', (data)=>{
    const pureData = {}
    Object.keys(data).forEach((key)=>{ pureData[key] = data[key][0] })
    return pureData
  })
  loadDB('story_character', 'story/story_character.json', (data)=>{
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
  })

  return {
    get error(){ return error },
    get finish(){ return finish }
  }
}

export default main
