
import route from './initRoute'

const initState = {
  page: route.current,
  database: {
    encyclopedia: null,
    character: null,
    character_text: null,
    story_character: null,
  }
}

let state = $state(initState)

export default state
