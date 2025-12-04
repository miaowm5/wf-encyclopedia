
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
  }else if (match('/ex-adv-quest/:item')){
    return { page: 'item', item: match('/ex-adv-quest/:item').item, extra: 'adv-quest' }
  }else if (match('/ex-single-quest/:item')){
    return { page: 'item', item: match('/ex-single-quest/:item').item, extra: 'single-quest' }
  }else if (match('/ex-character/:item')){
    return { page: 'item', item: match('/ex-character/:item').item, extra: 'character' }
  }else if (match('/config')){
    return { page: 'config' }
  }else if (match('/music')){
    return { page: 'music', extra: null }
  }else if (match('/music/:album/:name')){
    return { page: 'music', extra: match('/music/:album/:name') }
  }else if (match('/:item')){
    return { page: 'item', item: match('/:item').item, extra: null }
  }
  return { page: 'home', category: null }
}

const route = new Route(routeData)

export default route
