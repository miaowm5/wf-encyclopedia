
import route from './initRoute'
import state from './initState.svelte.js'

const setDatabase = (db, data)=>{
  state.database[db] = data
}
const setListHide = (hide)=>{
  state.ui.mobileListHide = hide
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
const triggerFilter = (value)=>{
  state.ui.listFilterOpen = value
}
const changeFilter = (filter)=>{
  state.ui.listFilter = filter
}

const updateRoute = ((data)=>{
  if (data.page === 'item'){
    state.item = data.item
    state.ui.mobileListHide = true
  }else if (data.page === 'home'){
    state.item = null
    state.ui.mobileListHide = false
    document.title = import.meta.env.VITE_SITE_NAME
  }
})
route.onUpdate(updateRoute)
updateRoute(route.current)

const store = {
  get state(){ return state },
  route,
  setDatabase,
  setListHide,
  changeTab,
  changeCategory,
  changeSearch,
  triggerFilter,
  changeFilter,
}

export default store
