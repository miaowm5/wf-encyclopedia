
const cacheMap = {}

const func = {
  get: (key)=>{ return cacheMap[key] },
  set: (key, canvas)=>{ cacheMap[key] = canvas },
}

export default func
