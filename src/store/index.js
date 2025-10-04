
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
    document.title = getI18n('main.sitename')
    route.push('/')
    state.item = null
  }
}
const changeTab = (tab)=>{
  state.ui.detailTab = tab
}
const changeCategory = (category)=>{
  state.ui.listCategory = category
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
  changeCategory,
  changeSearch,
  changeFilter,
  setAllFilter,
  setDialog,
  tag: customTag.init(state),
}

export default store
