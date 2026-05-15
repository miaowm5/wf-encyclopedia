
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

const main = (cdnType='cdn1', url = '', forceRemote=false)=>{
  const target = {
    "cdn": forceRemote ? import.meta.env.VITE_CDN : cdn,
    "cdn2": forceRemote ? import.meta.env.VITE_CDN2 : cdn2,
    "cdn3": forceRemote ? import.meta.env.VITE_CDN3 : cdn3,
    "cdn4": forceRemote ? import.meta.env.VITE_CDN4 : cdn4,
  }[cdnType] || (forceRemote ? import.meta.env.VITE_CDN : cdn)
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
      success: (data)=>{ store.setDialog('appAssetsCheck', { target: data.cdn, force: true }, false) },
      after: ()=>{ success() }
    })
  })
}

const getInfo = ()=>{
  const list = ['cdn', 'cdn2', 'cdn3', 'cdn4']
  const useable = list.map((name)=>!main(name).startsWith('http'))
  const allSet = useable.every(v=>v)
  return { list, useable, allSet }
}

export default main
export { appInit, getInfo }
