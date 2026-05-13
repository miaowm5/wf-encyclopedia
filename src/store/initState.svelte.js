
import customTag from "./customTag"
import { getValue as jukeboxGetValue } from './jukebox'

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
  mode: import.meta.env.VITE_APPMODE,
  ui: {
    page: 'home',
    listCategory: null,
    listFilter: {},
    allListFilter: '',
    detailTab: 'info',
    mobileListHide: false,
    jukeboxOpen: false,
  },
  dialog: {
    type: null,
    data: null,
    closeable: true,
  },
  jukebox: {
    current: '',
    playing: false,
    loop: true,
    random: false,
    playList: jukeboxGetValue(),
  },
  config,
  customTag: customTag.load()
}

if (import.meta.env.VITE_APPMODE === 'web'){
  let pwa = window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (window.navigator.standalone) ||
    document.referrer.includes('android-app://')
  if (pwa){ initState.mode = 'pwa' }
}

let state = $state(initState)

export default state
