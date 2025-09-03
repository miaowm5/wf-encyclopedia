
import customTag from "./customTag"

const initState = {
  item: null,
  ui: {
    listCategory: null,
    listSearch: '',
    listFilter: {},
    listFilterOpen: false,
    detailTab: 'info',
    mobileListHide: false,
  },
  database: {
    encyclopedia: null,
    character: null,
    character_text: null,
    story_character: null,
  },
  customTag: customTag.load()
}

let state = $state(initState)

export default state
