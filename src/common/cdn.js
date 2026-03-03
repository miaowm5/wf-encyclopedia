
let cdn = import.meta.env.VITE_CDN
let cdn2 = import.meta.env.VITE_CDN2
let cdn3 = import.meta.env.VITE_CDN3
let cdn4 = import.meta.env.VITE_CDN4

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
}

export default main
export { appInit }
