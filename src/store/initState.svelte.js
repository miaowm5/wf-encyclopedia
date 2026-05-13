
import customTag from "./customTag"
import { getValue as jukeboxGetValue } from './jukebox'
import initConfig from './initConfig'

let config = initConfig()

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
    loop: config.jukeboxLoop,
    random: config.jukeboxRandom,
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
