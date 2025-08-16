
import route from './initRoute'
import state from './initState.svelte.js'




const setPage = (page)=>{
  state.page = page
}
const setDatabase = (db, data)=>{
  state.database[db] = data
}

route.onUpdate((data)=>{ setPage(data) })

const store = {
  get state(){ return state },
  route,
  setDatabase,
}

export default store
