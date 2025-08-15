
import { Route } from '../common'

const routeData = (route)=>{
  const match = route.match

  return { page: 'home' }
}

const route = new Route(routeData)

export default route
