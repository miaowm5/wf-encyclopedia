
import customTag from "./customTag"

const initState = {
  item: null,
  scenario: null,
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
    character_speech_text: null,
    story_character: null,
    character_quest: null,
    normal_quest: null,
  },
  customTag: customTag.load()
}

let state = $state(initState)

export default state
