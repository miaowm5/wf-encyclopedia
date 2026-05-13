
import { api } from './m5api'
import store from '../store'

let cdn
let cdn2
let cdn3
let cdn4

const initCDN = ()=>{
  cdn = import.meta.env.VITE_CDN
  cdn2 = import.meta.env.VITE_CDN2
  cdn3 = import.meta.env.VITE_CDN3
  cdn4 = import.meta.env.VITE_CDN4
}

initCDN()

const main = (cdnType='cdn1', url = '')=>{
  const target = {
    "cdn": cdn,
    "cdn2": cdn2,
    "cdn3": cdn3,
    "cdn4": cdn4,
  }[cdnType] || cdn
  return `${target}${url}`
}

const appInit = async ()=>{
  initCDN()
  const check = async (target, callback)=>{
    try{
      let stats = await Neutralino.filesystem.getStats(NL_PATH + target)
      if (!stats.isDirectory){ throw new Error('CDN path error') }
      callback(target)
    }catch(e){}
  }
  await Promise.all([
    check('/cdn/cdn/', (v)=>cdn = v),
    check('/cdn/cdn2/', (v)=>cdn2 = v),
    check('/cdn/cdn3/', (v)=>cdn3 = v),
    check('/cdn/cdn4/', (v)=>cdn4 = v),
  ])
  await new Promise((success)=>{
    api('/cdn/task.json', {
      success: (data)=>{ store.setAppUpdater(data.cdn, true) },
      after: ()=>{ success() }
    })
  })
}

export default main
export { appInit }
