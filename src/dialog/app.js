
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
  if (import.meta.env.VITE_APPMODE !== 'app'){ return '00000000' }
  if (import.meta.env.VITE_APPMODE === 'app'){
    const CRC32 = await import('crc-32')
    let data = await Neutralino.filesystem.readBinaryFile(`${NL_PATH}/${file}`)
    let uint8View = new Uint8Array(data)
    const crcInt = CRC32.buf(uint8View)
    const crcHex = (crcInt >>> 0).toString(16).padStart(8, '0')
    return crcHex
  }
}
const generateTask = (local, remote)=>{
  const download = []
  const remove = []
  Object.keys(local).forEach((file)=>{
    let localVersion = local[file]
    let remoteVersion = remote[file]
    if (!remoteVersion){ remove.push(file) }
    else if (localVersion !== remoteVersion){ download.push(file) }
  })
  Object.keys(remote).forEach((file)=>{
    let localVersion = local[file]
    if (!localVersion){ download.push(file) }
  })
  return { remove, download }
}
const triggerUpdaterFlag = async (cdn)=>{
  if (cdn){
    await Neutralino.filesystem.writeFile(`${NL_PATH}/cdn/task.json`, JSON.stringify({cdn}))
  }else{
    await removeFile('cdn/task.json')
  }
}

export default {
  getLocalFile,
  calculateCRC32,
  generateTask,
  triggerUpdaterFlag,
}
