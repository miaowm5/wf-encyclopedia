
import { cdn } from '../../common'
import { getInfo as getCDNInfo } from '../../common/cdn'

const removeFile = async (file)=>{
  try{
    await Neutralino.filesystem.remove(`${NL_PATH}/${file}`)
  }catch(e){
    console.error(e)
  }
}
const downloadFile = async (cdnType, path)=>{
  const url = cdn(cdnType, path, true)
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
const triggerUpdaterFlag = async ()=>{
  await removeFile('cdn/task.json')
}

export default {
  getCDNInfo,
  removeFile,
  downloadFile,
  triggerUpdaterFlag,
}
