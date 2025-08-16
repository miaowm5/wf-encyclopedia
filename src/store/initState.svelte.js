
const initState = {
  item: null,
  category: null,
  ui: {
    mobileListHide: false
  },
  database: {
    encyclopedia: null,
    character: null,
    character_text: null,
    story_character: null,
  }
}

let state = $state(initState)

export default state
