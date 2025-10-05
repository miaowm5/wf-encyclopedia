
import { onDestroy } from 'svelte'
import parse from './parseData'
import loadConfig from './loadData'

const main = (path)=>{
  let cancelFunc = false
  let data = $state(null)
  onDestroy(()=>{ cancelFunc = true })

  const load = async ()=>{
    if (!path){ return }
    const config = await loadConfig(path)
    if (cancelFunc){ return }
    if (!config){ return }
    if (!config[path]){ return }
    data = parse(config[path])
  }
  load()
  return {
    get data(){ return data },
  }
}

export default main
