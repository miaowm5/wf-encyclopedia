
import { Route } from '../common'

const routeData = (route)=>{
  const match = route.match
  if (match('/character')){
    return { page: 'home', category: 'character' }
  }else if (match('/story')){
    return { page: 'home', category: 'story' }
  }else if (match('/all')){
    return { page: 'home', category: 'all' }
  }else if (match('/scenario/:type/:item')){
    let data = match('/scenario/:type/:item')
    return { page: 'scenario', type: data.type, item: data.item }
  }else if (match('/:item')){
    return { page: 'item', item: match('/:item').item }
  }
  return { page: 'home', category: null }
}

const route = new Route(routeData)

export default route
