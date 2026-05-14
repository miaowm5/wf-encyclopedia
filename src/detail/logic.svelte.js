
import store from '../store'
import extarGallery from '../database/extraGallery.json'

const main = ()=>{

  const loadDB = $derived.by(()=>{
    const list = []
    if (store.state.item){
      list.push('encyclopedia')
      list.push('character')
    }
    if (store.state.extra){
      if (store.state.extra === 'character'){
        list.push('character_text')
      }else{
        list.push('extra_quest')
      }
    }
    return store.database(...list)
  })

  const item = $derived.by(()=>{
    const id = store.state.item
    if (!id){ return null }
    if (!loadDB.finish){ return null }
    let extraType = store.state.extra
    if (extraType === 'character'){
      const character = loadDB.db['character'][id]
      const characterText = loadDB.db['character_text'][id]
      if (!character){ return null }
      const result = {
        type: 'character',
        releated: [],
        desc: [[characterText[2].split('\n')]],
        title: characterText[0],
        characterID: id,
        storyID: character[8],
      }
      return result
    }else if (extraType){
      const extraQuest = loadDB.db['extra_quest']
      const result = {
        type: 'story',
        releated: [],
        desc: [],
        title: '',
      }
      let questItem = null
      if (extraType === 'adv-quest'){
        questItem = extraQuest['advent_event_quest'][id]
        result.subType = 'event-quest'
      }else if (extraType === 'single-quest'){
        questItem = extraQuest['story_event_single_quest'][id]
        result.subType = 'event-single'
      }
      if (!questItem){ return null }
      result.title = questItem[2]
      result.storyID = id
      result.banner = questItem[4]
      result.eventID = `event_${questItem[0]}`
      result.desc = [[result.title]]
      return result
    }
    const data = loadDB.db.encyclopedia[id]
    return data
  })

  const tab = $derived.by(()=>{
    if (!item){ return stateTab }
    let character = null
    if (item.type === 'character'){ character = loadDB.db.character[item.characterID] }
    const stateTab = store.state.ui.detailTab
    if (stateTab === 'gallery'){
      if (item.type === 'story'){
        if (item.subType === 'main'){ return 'gallery' }
        if (extarGallery[item.eventID]){ return 'gallery' }
        if (store.state.extra){ return 'story' }
        return 'info'
      }else if (item.type !== 'character' && item.type !== 'npc'){
        return 'info'
      }
    }
    if (stateTab === 'story'){
      if (item.type === 'character'){
        if (!character){ return 'info' }
        const rarity = character[2]
        if (rarity !== '3' && rarity !== '4' && rarity !== '5'){
          return 'info'
        }
      }else if (item.type !== 'story'){
        return 'info'
      }
    }
    if (stateTab === 'voice'){
      if (item.type === 'character'){
        const rarity = character[2]
        if (rarity !== '3' && rarity !== '4' && rarity !== '5'){
          const cid = character[0]
          if (cid !== 'towa_vtuber' && cid !== 'towa_namakubi'){
            return 'voice-none'
          }
        }
      }else if (item.type !== 'story'){
        return 'info'
      }
    }
    if (stateTab === 'info'){
      if (item.type === 'story' && store.state.extra){
        return 'story'
      }
    }
    return stateTab
  })

  return {
    get loadDB(){ return loadDB },
    get item(){ return item },
    get tab(){ return tab },
  }

}

export default main
