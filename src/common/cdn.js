
import { api } from './m5api'
import store from '../store'

let cdnRemote = {
  cdn: import.meta.env.VITE_CDN,
  cdn2: import.meta.env.VITE_CDN2,
  cdn3: import.meta.env.VITE_CDN3,
  cdn4: import.meta.env.VITE_CDN4,
}
let cdnUse = {}

const initCDN = ()=>{
  cdnUse = { ...cdnRemote }
}

initCDN()

const main = (cdnType='cdn1', url = '', forceRemote=false)=>{
  const cdn = forceRemote ? cdnRemote : cdnUse
  const target = cdn[cdnType] || cdn['cdn']
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
    check('/cdn/cdn/', (v)=>cdnUse['cdn'] = v),
    check('/cdn/cdn2/', (v)=>cdnUse['cdn2'] = v),
    check('/cdn/cdn3/', (v)=>cdnUse['cdn3'] = v),
    check('/cdn/cdn4/', (v)=>cdnUse['cdn4'] = v),
  ])
  await new Promise((success)=>{
    api('/cdn/task.json', {
      success: (data)=>{
        initCDN()
        store.setDialog('appAssetsCheck', { target: data.cdn, force: true }, false)
      },
      fail: ()=>{},
      after: ()=>{ success() }
    })
  })
}

const getInfo = ()=>{
  const list = Object.keys(cdnRemote)
  const useable = list.map((name)=>!main(name).startsWith('http'))
  const allSet = useable.every(v=>v)
  return { list, useable, allSet }
}

export default main
export { appInit, getInfo }
