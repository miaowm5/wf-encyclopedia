
import customTag from "./customTag"

const initState = {
  item: null,
  ui: {
    listCategory: null,
    listSearch: '',
    listFilter: {},
    allListFilter: '',
    detailTab: 'info',
    mobileListHide: false,
  },
  dialog: {
    type: null,
    data: null,
    closeable: true,
  },
  database: {
    encyclopedia: null,
    character: null,
    character_text: null,
    character_speech: null,
    story_character: null,
  },
  customTag: customTag.load()
}

let state = $state(initState)

export default state
