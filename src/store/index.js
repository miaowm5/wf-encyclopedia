
import route from './initRoute'
import state from './initState.svelte.js'
import customTag from './customTag.js'
import dbLoader from './db.svelte.js'
import i18n from './i18n.json'

const setScenario = (scenario)=>{
  if (scenario){
    let path = scenario.path
    let url = ''
    if (path.startsWith('story/character_story_quest/')){
      url = `character/${path.split('/')[2]}`
    }else if (path.startsWith('story/story_quest/')){
      url = `main/${path.split('/')[3]}`
    }else if (path.startsWith('story/story_event_quest/')){
      url = `event/${path.split('/')[2]}-${path.split('/')[3]}`
    }else if (path.startsWith('story/advent_event/')){
      url = `advent/${path.split('/')[2]}-${path.split('/')[3]}`
    }else if (path.startsWith('story/system_quest/')){
      url = `system/${path.split('/')[2]}`
    }
    if (url){ route.push(`/scenario/${url}`) }
  }else{
    if (state.item){ history.go(-1) }
    else{
      state.ui.mobileListHide = false
      route.push(`/`)
    }
  }
  state.scenario = scenario
}
const setListHide = (show)=>{
  state.ui.mobileListHide = show
  if (!show){
    state.item = null
    let category = state.ui.listCategory
    if (category === 'character'){
      route.push('/character')
    }else if (category === 'story'){
      route.push('/story')
    }else if (category === 'all'){
      route.push('/all')
    }else{
      route.push('/')
    }
  }
}
const changeTab = (tab)=>{
  state.ui.detailTab = tab
}
const changeSearch = (search)=>{
  state.ui.listSearch = search
}
const changeFilter = (filter)=>{
  state.ui.listFilter = filter
}
const setAllFilter = (text)=>{
  state.ui.allListFilter = text
}
const setDialog = (type, data = null, closeable = true)=>{
  state.dialog = { type, data, closeable }
}
const getI18n = (path)=>{
  const p = path.split('.')
  let result = i18n
  p.forEach((key)=>{
    if (!result){ return }
    result = result[key]
  })
  if (!result){ return path }
  if (state.config.language === 'en'){ return result[1] || path }
  if (state.config.language === 'jp'){ return result[2] || path }
  return result[0] || path
}
const changeConfig = (key, value)=>{
  if (state.config[key] === value){ return }
  state.config[key] = value
  localStorage.setItem('config', JSON.stringify(state.config))
}

const updateRoute = ((data)=>{
  if (data.page === 'item'){
    if (state.item !== data.item || state.extra !== data.extra){
      state.ui.mobileListHide = true
      state.item = data.item
      state.extra = data.extra
    }
    state.scenario = null
    state.ui.configOpen = false
  }else if (data.page === 'home'){
    state.item = null
    state.scenario = null
    state.ui.mobileListHide = false
    document.title = getI18n('main.sitename')
    state.ui.listCategory = data.category
    state.ui.configOpen = false
  }else if (data.page === 'scenario'){
    if (state.scenario){ return }
    let url = {
      character: 'story/character_story_quest/',
      main: 'story/story_quest/',
      event: 'story/story_event_quest/',
      advent: 'story/advent_event/',
      system: 'story/system_quest/',
    }[data.type] || ''
    if (data.type === 'character'){
      url += data.item
    }else if (data.type === 'main'){
      url += data.item.slice(0, data.item.length - 3)
      url += `/${data.item}`
    }else if (data.type === 'event'){
      url += data.item.split('-').join('/')
    }else if (data.type === 'advent'){
      url += data.item.split('-').join('/')
    }else if (data.type === 'system'){
      url += data.item
    }
    url += '/scenario'
    state.scenario = { path: url }
    state.ui.mobileListHide = true
    state.ui.configOpen = false
  }else if (data.page === 'config'){
    state.item = null
    state.scenario = null
    state.ui.mobileListHide = true
    state.ui.configOpen = true
    document.title = getI18n('main.sitename')
  }
})
route.onUpdate(updateRoute)
updateRoute(route.current)

const store = {
  get state(){ return state },
  route,
  i18n: getI18n,
  setScenario,
  setListHide,
  changeTab,
  changeSearch,
  changeFilter,
  setAllFilter,
  setDialog,
  changeConfig,
  tag: customTag.init(state),
  database: dbLoader(state),
}

export default store
