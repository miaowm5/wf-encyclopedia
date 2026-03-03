
import CRC32 from 'crc-32'
import { cdn, api } from '../../common'

const getCDNInfo = ()=>{
  const list = ['cdn', 'cdn2', 'cdn3', 'cdn4']
  const useable = list.map((name)=>!cdn(name).startsWith('http'))
  const allSet = useable.every(v=>v)
  return { list, useable, allSet }
}
const getLocalFile = async (dir, root='')=>{
  if (!root){ root = dir }
  let result = []
  try{
    let entries = await Neutralino.filesystem.readDirectory(`${NL_PATH}/${dir}`)
    for (const item of entries){
      if (item.type === 'FILE'){
        result.push(`${dir}${item.entry}`.slice(root.length))
      }else{
        let sub = await getLocalFile(`${dir}${item.entry}/`, root)
        result = [...result, ...sub]
      }
    }
  }catch(e){
    if (e.code === 'NE_FS_NOPATHE'){ return [] }
    throw e
  }
  return result
}
const calculateCRC32 = async (file)=>{
  let data = await Neutralino.filesystem.readBinaryFile(`${NL_PATH}/${file}`)
  let uint8View = new Uint8Array(data)
  const crcInt = CRC32.buf(uint8View)
  const crcHex = (crcInt >>> 0).toString(16).padStart(8, '0')
  return crcHex
}
const getRemoteCDN = (cdnType)=>{
  return {
    "cdn": import.meta.env.VITE_CDN,
    "cdn2": import.meta.env.VITE_CDN2,
    "cdn3": import.meta.env.VITE_CDN3,
    "cdn4": import.meta.env.VITE_CDN4,
  }[cdnType] || import.meta.env.VITE_CDN
}
const getVersionInfo = async (cdnType)=>{
  const target = getRemoteCDN(cdnType)
  return await new Promise((success, fail)=>{
    api(`${target}/version.json`, {
      cors: true,
      success: (data)=>{ success(data) },
      fail: (e)=>{ fail(e) },
    })
  })
}
const removeFile = async (file)=>{
  try{
    await Neutralino.filesystem.remove(`${NL_PATH}/${file}`)
  }catch(e){
    console.error(e)
  }
}
const downloadFile = async (cdnType, path)=>{
  const url = getRemoteCDN(cdnType) + path
  const response = await fetch(url)
  if (!response.ok){ throw new Error(`HTTP error! status: ${response.status}`) }
  const buffer = await response.arrayBuffer()
  const target = `${NL_PATH}/cdn/${cdnType}/${path}`
  const targetInfo = await Neutralino.filesystem.getPathParts(target)
  try{
    await Neutralino.filesystem.getStats(`${targetInfo.parentPath}`)
  }catch(e){
    await Neutralino.filesystem.createDirectory(targetInfo.parentPath)
  }
  await Neutralino.filesystem.writeBinaryFile(target, buffer)
}
const generateTask = (local, remote)=>{
  const download = []
  const remove = []
  Object.keys(local).forEach((file)=>{
    let localVersion = local[file]
    let remoteVersion = remote[file]
    if (!remoteVersion){ remove.push(file) }
    if (localVersion !== remoteVersion){ download.push(file) }
  })
  Object.keys(remote).forEach((file)=>{
    let localVersion = local[file]
    if (!localVersion){ download.push(file) }
  })
  return { remove, download }
}

export default {
  getCDNInfo,
  getLocalFile,
  getVersionInfo,
  calculateCRC32,
  removeFile,
  downloadFile,
  generateTask,
}
