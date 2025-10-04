
const fs = require('fs')
const path = require('path')

const inputBase = path.join(__dirname, 'orderedmap/quest');
const outputBase = path.join(__dirname, 'output/normal_quest.json');

let result = {}

{
  let key = 'main_quest'
  const file = JSON.parse(fs.readFileSync(path.join(inputBase, `${key}.json`)).toString())
  result[key] = {}
  Object.keys(file).forEach((id)=>{
    result[key][id] = []
    Object.keys(file[id]).forEach((node)=>{
      Object.keys(file[id][node]).forEach((item)=>{
        let odata = file[id][node][item]
        if (!odata[121]){ return }
        let data = [odata[1], odata[121], odata[122], odata[123], odata[124]]
        result[key][id].push(data)
      })
    })
  })
}

{
  let key = 'event/advent_event_quest'
  const file = JSON.parse(fs.readFileSync(path.join(inputBase, `${key}.json`)).toString())
  result[key] = {}
  Object.keys(file).forEach((id)=>{
    let story = []
    Object.keys(file[id]).forEach((item)=>{
      let odata = file[id][item]
      if (!odata[127]){ return }
      let data = [odata[2], odata[127], odata[128], odata[129], odata[130]]
      story.push(data)
    })
    if (story.length > 0){ result[key][id] = story }
  })
}

{
  let key = 'event/story_event_single_quest'
  const file = JSON.parse(fs.readFileSync(path.join(inputBase, `${key}.json`)).toString())
  result[key] = {}
  Object.keys(file).forEach((id)=>{
    let story = []
    Object.keys(file[id]).forEach((item)=>{
      let odata = file[id][item]
      if (!odata[123]){ return }
      let data = [odata[2], odata[123], odata[124], odata[125], odata[126]]
      story.push(data)
    })
    if (story.length > 0){ result[key][id] = story }
  })
}

{
  let key = 'event/world_story_event_quest'
  const file = JSON.parse(fs.readFileSync(path.join(inputBase, `${key}.json`)).toString())
  result[key] = {}
  Object.keys(file).forEach((id)=>{
    let story = []
    Object.keys(file[id]).forEach((item)=>{
      let odata = file[id][item]
      if (!odata[122]){ return }
      let data = [odata[2], odata[122], odata[123], odata[124], odata[125]]
      story.push(data)
    })
    if (story.length > 0){ result[key][id] = story }
  })
}

fs.writeFileSync(outputBase, JSON.stringify(result, null, 2));
