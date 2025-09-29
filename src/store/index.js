
import route from './initRoute'
import state from './initState.svelte.js'
import customTag from './customTag.js'

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
const changeFilter = (filter)=>{
  state.ui.listFilter = filter
}
const setAllFilter = (text)=>{
  state.ui.allListFilter = text
}
const setDialog = (type, data = null, closeable = true)=>{
  state.dialog = { type, data, closeable }
}

const updateRoute = ((data)=>{
  if (data.page === 'item'){
    if (state.item !== data.item){
      state.ui.mobileListHide = true
    }
    state.item = data.item
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
  changeFilter,
  setAllFilter,
  setDialog,
  tag: customTag.init(state),
}

export default store
