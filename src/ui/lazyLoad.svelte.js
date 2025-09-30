
import { onMount } from "svelte"

const wrap = (dom, lazyLoad)=>{
  let load = $state(!lazyLoad)
  let observer = null

  const clear = ()=>{
    if (!observer){ return }
    observer.disconnect()
    observer = null
  }
  onMount(()=>{
    if (!lazyLoad){ return }
    observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if (!entry.isIntersecting){ return }
        load = true
        clear()
      })
    })
    return clear
  })

  let lastNode = null
  $effect(()=>{
    if (!observer){ return }
    if (!dom){ return }
    let node = dom()
    if (!node){ return }
    observer.observe(node)
    if (lastNode){ observer.unobserve(lastNode) }
    lastNode = node
  })

  return {
    get load(){ return load }
  }
}

export default wrap
