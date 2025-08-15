import { onDestroy, onMount } from "svelte"
import { api } from './m5api'

const wrap = (url, option, mountRun = false)=>{
  let cancelFunc = null
  const stopPrevious = ()=>{ if (cancelFunc){ cancelFunc() } }
  onDestroy(()=>{ stopPrevious() })

  let state = $state('idle')
  const execute = ()=>{
    stopPrevious()
    state = 'pending'
    cancelFunc = api(url, {
      ...option,
      after: ()=>{
        if (option.after){ option.after() }
        state = 'idle'
        cancelFunc = null
      },
    })
    return cancelFunc
  }
  if (mountRun){ onMount(execute) }

  return {
    execute,
    cancel: stopPrevious,
    get state(){ return state },
  }
}

export default wrap
