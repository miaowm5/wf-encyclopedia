
import route from './initRoute'
import state from './initState.svelte.js'

const setDatabase = (db, data)=>{
  state.database[db] = data
}

const updateRoute = ((data)=>{
  if (data.page === 'category'){
    state.category = data.category
    state.item = null
  }
  if (data.page === 'item'){
    state.item = data.item
  }
})
route.onUpdate(updateRoute)
updateRoute(route.current)

const store = {
  get state(){ return state },
  route,
  setDatabase,
}

export default store
