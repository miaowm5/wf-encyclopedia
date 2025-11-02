
import { api } from '../../common'

const loadConfig = async (path, dataRegion)=>{
  let url = ``
  if (path.startsWith('story/character_story_quest/')){
    let character = path.split('/')[2]
    character = character.slice(0, character.length - 4)
    url = `character_story_quest/${character}`
  }else if (path.startsWith('story/story_quest/')){
    let chapter = path.split('/')[2]
    url = `story_quest/${chapter}`
  }else if (path.startsWith('story/story_event_quest/')){
    let chapter = path.split('/')[2]
    url = `story_event_quest/${chapter}`
  }else if (path.startsWith('story/advent_event/')){
    let chapter = path.split('/')[2]
    url = `advent_event/${chapter}`
  }else if (path.startsWith('story/system_quest/')){
    let chapter = path.split('/')[2]
    url = `system_quest/${chapter}`
  }
  let promise = new Promise((resolve)=>{
    const baseUrl = {
      cn: `${import.meta.env.VITE_CDN3}orderedmap/`,
      jp: `${import.meta.env.VITE_CDN3}orderedmap2/`
    }[dataRegion] || `${import.meta.env.VITE_CDN3}orderedmap/`
    api(`${baseUrl}story/${url}.json`, {
      success: (data)=>{ resolve(data) },
      fail: (err)=>{ console.error(err), resolve(null) },
      cors: true,
    })
  })
  const result = await promise
  return result
}

export default loadConfig
