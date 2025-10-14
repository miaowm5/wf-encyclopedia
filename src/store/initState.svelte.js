
import customTag from "./customTag"

let config = {}
let configData = {}

try{ configData = JSON.parse(localStorage.getItem('config') || `{}`) }
catch(e){ configData = {} }
config.dataRegion = configData.dataRegion || 'cn'
config.language = configData.language || 'cn'

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
    configOpen: false,
  },
  dialog: {
    type: null,
    data: null,
    closeable: true,
  },
  config,
  customTag: customTag.load()
}

let state = $state(initState)

export default state
