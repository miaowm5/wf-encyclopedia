
const version = 20250902
const key = 'customTag'

const load = ()=>{
  try{
    let data = JSON.parse(
      localStorage.getItem(key) || `{ "version": ${version}, "tag": [] }`
    )
    if (data.version !== version){
      // PUT UPDATE OLD DATA LOGIC HERE
    }
    const result = []
    data.tag.forEach((group)=>{
      if (!group[0]){ return }
      let resultGroup = []
      resultGroup.push({ name: group[0].name || 'NewGroup', })
      resultGroup.forEach((item, index)=>{
        if (index === 0 || !item){ return }
        resultGroup.push({
          name: item.name || 'NewTag',
          list: item.list || [],
        })
      })
      if (resultGroup.length > 0){ result.push(resultGroup) }
    })
    return result
  }catch(e){}
  return []
}
const save = (tag)=>{ localStorage.setItem(key, JSON.stringify({ version, tag })) }

const init = (state)=>{
  const addGroup = ()=>{
    state.customTag.push([{ name: 'NewGroup' }])
    save(state.customTag)
  }
  const delGroup = (index)=>{
    state.customTag.splice(index, 1)
    save(state.customTag)
  }
  const renameGroup = (index, name)=>{
    state.customTag[index][0].name = name
    save(state.customTag)
  }
  const addTag = (group)=>{
    state.customTag[group].push({ name: 'NewTag', list: [] })
    save(state.customTag)
  }
  const delTag = (group, index)=>{
    if (index === 0){ return }
    state.customTag[group].splice(index, 1)
    save(state.customTag)
  }
  const renameTag = (group, index, name)=>{
    state.customTag[group][index].name = name
    save(state.customTag)
  }
  const addItem = (group, index, item)=>{
    if (state.customTag[group][index].list.includes(item)){ return }
    state.customTag[group][index].list.push(item)
    save(state.customTag)
  }
  const delItem = (group, index, item)=>{
    let list = state.customTag[group][index].list.filter((id)=>id !== item)
    state.customTag[group][index].list = list
    save(state.customTag)
  }
  return {
    addGroup,
    delGroup,
    renameGroup,
    addTag,
    delTag,
    renameTag,
    addItem,
    delItem,
  }
}

const customTag = {
  load,
  init,
}

export default customTag
