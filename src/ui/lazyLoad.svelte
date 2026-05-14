<script>
  import { onMount } from "svelte"

  const { load: loadFunc, lazy, children } = $props()

  let node = $state(null)
  let load = $state((()=>!lazy)())
  let observer = null
  let loadTimer = null

  const clear = ()=>{
    if (loadTimer){ clearTimeout(loadTimer); loadTimer = null }
    if (!observer){ return }
    observer.disconnect()
    observer = null
  }
  const executeLoad = ()=>{
    load = true
    loadFunc()
    clear()
  }
  (()=>{ if (!lazy){ executeLoad() } })()

  onMount(()=>{
    if (!lazy){ return }
    observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if (load){ return }
        if (!entry.isIntersecting){
          if (loadTimer){ clearTimeout(loadTimer); loadTimer = null }
        }else if (!loadTimer){
          loadTimer = setTimeout(()=>{ executeLoad() }, 200)
        }
      })
    }, {
      root: null,
      threshold: 0,
    })
    return clear
  })

  $effect(()=>{
    if (!observer){ return }
    if (!node){ return }
    observer.observe(node)
    return ()=>{
      if (!observer){ return }
      observer.unobserve(node)
    }
  })
</script>

{#if !load}
  <span bind:this={node}>
    {@render children?.()}
  </span>
{:else}
  {@render children?.()}
{/if}

<style>
  span{
    display: block;
    min-height: 1px;
  }
</style>
