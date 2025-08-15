
import route from './initRoute'
import state from './initState.svelte.js'




const setPage = (page)=>{
  state.page = page
}

route.onUpdate((data)=>{ setPage(data) })

const store = {
  get state(){ return state },
  route,
}

export default store
