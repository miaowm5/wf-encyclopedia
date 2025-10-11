
import customTag from "./customTag"

const initState = {
  item: null,
  extra: null,
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
  config: {
    language: 'cn',
    dataRegion: 'cn',
  },
  customTag: customTag.load()
}

let state = $state(initState)

export default state
