
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
  }
}

let state = $state(initState)

export default state
