
import { onDestroy } from 'svelte'
import { api } from '../../common'

const parse = (data)=>{
  const result = []
  Object.keys(data).forEach((index)=>{
    let items = data[index]
    items.forEach((item)=>{
      let type = item[0]
      let command = ''
      let param = []
      if (type === '0'){
        command = 'dialog'
        param = [item[4],item[5],item[6],item[7] === 'true',item[8]]
      }else if (type === '1'){
        command = 'bgm'
        param = [item[36]]
      }else if (type === '2'){
        command = 'bgm-mute'
      }else if (type === '3'){
        command = 'bgm2'
        param = [item[39], item[40]]
      }else if (type === '4'){
        command = 'silent'
        param = [item[41], item[42]]
      }else if (type === '5'){
        command = 'scene'
        param = [item[0],item[1] === 'true',item[2] === 'true']
      }else if (type === '6'){
        command = 'face'
        param = [item[12],item[13],item[14],item[15] === 'true']
      }else if (type === '7'){
        command = 'face-hide'
        param = [item[16]]
      }else if (type === '8'){
        command = 'face-clean'
      }else if (type === '9'){
        command = 'face-focus'
        param = [item[9]]
      }else if (type === '10'){
        command = 'face-focus2'
        param = [item[10]]
      }else if (type === '11'){
        command = 'face-unfocus'
        param = [item[11]]
      }else if (type === '12'){
        command = 'face-change'
        param = [item[19],item[20]]
      }else if (type === '13'){
        command = 'face-effect'
        param = [item[21],item[22]]
      }else if (type === '14'){
        command = 'shake-start'
        param = [item[27],item[28]]
      }else if (type === '15'){
        command = 'shake-over'
      }else if (type === '18'){
        command = 'screen-grey'
      }else if (type === '19'){
        command = 'screen-hue'
        param = [item[31],item[32]]
      }else if (type === '20'){
        command = 'screen-normal'
      }else if (type === '22'){
        command = 'start'
      }else{
        console.log(JSON.stringify(item))
        command = 'unknown'
        param = [JSON.stringify(item)]
      }
      result.push({ command, param: param.length > 0 ? param : undefined })
    })
  })
  return result
}
const loadConfig = async (path)=>{
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
    url = `system_quest/${chapter}/scenario`
  }
  let promise = new Promise((resolve)=>{
    api(`${import.meta.env.VITE_CDN3}orderedmap/story/${url}.json`, {
      success: (data)=>{ resolve(data) },
      fail: (err)=>{ console.error(err), resolve(null) },
      cors: true,
    })
  })
  const result = await promise
  return result
}

const main = (path)=>{
  let cancelFunc = false
  let data = $state(null)
  onDestroy(()=>{ cancelFunc = true })

  const load = async ()=>{
    if (!path){ return }
    const config = await loadConfig(path)
    if (cancelFunc){ return }
    if (!config){ return }
    if (!config[path]){ return }
    data = parse(config[path])
  }
  load()
  return {
    get data(){ return data },
  }
}

export default main
