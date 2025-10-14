
import customTag from "./customTag"

let config = {}
let configData = {}

try{ configData = JSON.parse(localStorage.getItem('config') || `{}`) }
catch(e){ configData = {} }
let defaultLang = 'cn'
const lang = navigator.language || navigator.userLanguage
if (lang.startsWith('ja')) { defaultLang = 'jp' }
else if (lang.startsWith('en')){ defaultLang = 'en' }

config.dataRegion = configData.dataRegion || defaultLang
config.language = configData.language || defaultLang

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
