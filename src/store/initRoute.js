
import { Route } from '../common'

const routeData = (route)=>{
  const match = route.match
  if (match('/category/:c')){
    return { page: 'category', category: match('/category/:c').c }
  }
  if (match('/:item')){
    return { page: 'item', item: match('/:item').item }
  }
  return { page: 'home' }
}

const route = new Route(routeData)

export default route
