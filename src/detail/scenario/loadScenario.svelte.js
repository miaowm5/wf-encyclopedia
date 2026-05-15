
import { wrapApi, cdn } from '../../common'
import parse from './parseData'

const getUrl = (path, dataRegion)=>{
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
  const baseUrl = {
    cn: cdn('cdn3', 'orderedmap/'),
    jp: cdn('cdn3', 'orderedmap2/')
  }[dataRegion] || cdn('cdn3', 'orderedmap/')
  return `${baseUrl}story/${url}.json`
}

const main = (pathFunc, dataRegionFunc)=>{
  let data = $state(null)
  const path = $derived.by(pathFunc)
  const dataRegion = $derived.by(dataRegionFunc)

  const loadAPI = wrapApi('story.json', {
    before: ()=>{ data = null },
    success: (config)=>{
      if (!config[path]){ return }
      data = parse(config[path], path.includes('main_chapter_00'))
    },
    fail: (err)=>{ console.error(err) },
    cors: true,
  }, true)

  $effect(()=>{
    if (!path){ return }
    return loadAPI.execute({ url: getUrl(path, dataRegion) })
  })

  return {
    get data(){ return data },
  }
}

export default main
