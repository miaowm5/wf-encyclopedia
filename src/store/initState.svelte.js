
import route from './initRoute'

const initState = {
  page: route.current,
}

let state = $state(initState)

export default state
