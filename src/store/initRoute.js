
import { Route } from '../common'

const routeData = (route)=>{
  const match = route.match
  if (match('/:item')){
    return { page: 'item', item: match('/:item').item }
  }
  return { page: 'home' }
}

const route = new Route(routeData)

export default route
