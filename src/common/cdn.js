
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
  cdn = '/cdn/cdn/'
  cdn2 = '/cdn/cdn1/'
  cdn3 = '/cdn/cdn2/'
  cdn4 = '/cdn/cdn3/'
}

export default main
export { appInit }
