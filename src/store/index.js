
import route from './initRoute'
import state from './initState.svelte.js'
import customTag from './customTag.js'
import i18n from './i18n.json'

const setDatabase = (db, data)=>{
  state.database[db] = data
}
const setScenario = (scenario)=>{
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
  return result[0]
}

const updateRoute = ((data)=>{
  if (data.page === 'item'){
    if (state.item !== data.item){
      state.ui.mobileListHide = true
      state.scenario = null
      state.item = data.item
    }
  }else if (data.page === 'home'){
    state.item = null
    state.scenario = null
    state.ui.mobileListHide = false
    document.title = getI18n('main.sitename')
    state.ui.listCategory = data.category
  }
})
route.onUpdate(updateRoute)
updateRoute(route.current)

const store = {
  get state(){ return state },
  route,
  i18n: getI18n,
  setDatabase,
  setScenario,
  setListHide,
  changeTab,
  changeSearch,
  changeFilter,
  setAllFilter,
  setDialog,
  tag: customTag.init(state),
}

export default store
