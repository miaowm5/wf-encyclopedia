
const load = ()=>{

  let configData = {}
  try{ configData = JSON.parse(localStorage.getItem('config') || `{}`) }
  catch(e){ configData = {} }

  let defaultLang = 'cn'
  const lang = navigator.language || navigator.userLanguage
  if (lang.startsWith('ja')) { defaultLang = 'jp' }
  else if (lang.startsWith('en')){ defaultLang = 'en' }

  let defaultConfig = {
    dataRegion: defaultLang,
    language: defaultLang,
    jukeboxLoop: true,
    jukeboxRandom: false,
  }

  let config = {}
  Object.keys(defaultConfig).forEach((key)=>{
    config[key] = configData[key] !== undefined ? configData[key] : defaultConfig[key]
  })

  return config
}

export default load
