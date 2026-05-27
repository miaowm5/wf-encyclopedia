
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
  const updater = await new Promise((success)=>{
    api('/cdn/task.json', {
      success: (data)=>{
        store.setDialog('appAssetsCheck', { target: data.cdn, force: true }, false)
        success(data.cdn)
      },
      fail: ()=>{ success() },
    })
  })
  const check = async (target, callback)=>{
    try{
      let stats = await Neutralino.filesystem.getStats(NL_PATH + target)
      if (!stats.isDirectory){ throw new Error('CDN path error') }
      callback(target)
    }catch(e){}
  }
  await Promise.all(Object.keys(cdnUse).filter(name=>name !== updater).map((name)=>{
    return check(`/cdn/${name}/`, (v)=>cdnUse[name] = v)
  }))
}

const getInfo = ()=>{
  const list = Object.keys(cdnRemote)
  const useable = list.map((name)=>!main(name).startsWith('http'))
  const allSet = useable.every(v=>v)
  return { list, useable, allSet }
}

export default main
export { appInit, getInfo }
