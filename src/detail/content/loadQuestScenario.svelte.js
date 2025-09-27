
import { onDestroy } from 'svelte'
import { api } from '../../common'

const parse = (data)=>{
  const result = {}
  Object.keys(data).forEach((file)=>{
    result[file] = []
    Object.keys(data[file]).forEach((index)=>{
      let items = data[file][index]
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
        }else if (type === '4'){
          command = 'shake'
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
          command = 'clean'
          param = []
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
        }else if (type === '22'){
          return
        }else{
          console.log(JSON.stringify(item))
          command = 'unknown'
          param = [JSON.stringify(item)]
        }
        result[file].push({ command, param })
      })
    })
  })
  return result
}
const loadConfig = async (id)=>{
  const url = `/orderedmap/story/character_story_quest/${id}.json`
  let promise = new Promise((resolve)=>{
    api(url, {
      success: (data)=>{ resolve(parse(data)) },
      fail: (err)=>{ console.error(err), resolve(null) },
      cors: true,
    })
  })
  const result = await promise
  return result
}

const main = (character)=>{
  let cancelFunc = false
  let data = $state(null)
  onDestroy(()=>{ cancelFunc = true })

  const load = async ()=>{
    if (!character){ return }
    const config = await loadConfig(character)
    if (cancelFunc){ return }
    if (!config){ return }
    data = config
  }
  load()
  return {
    get(story){
      if (!data){ return null }
      return data[story]
    },
  }
}

export default main
