<script>
  const { load: loadFunc, lazy, children, loaded, lazyTime = 0 } = $props()

  let load = $state((()=>!lazy)())
  let loadTimer = null

  const clear = ()=>{
    if (loadTimer){ clearTimeout(loadTimer); loadTimer = null }
  }
  const executeLoad = ()=>{
    load = true
    if (loadFunc){ loadFunc() }
    clear()
  }
  (()=>{ if (!lazy){ executeLoad() } })()

  const regLazy = (node)=>{
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if (!entry.isIntersecting){
          if (loadTimer){ clearTimeout(loadTimer); loadTimer = null }
        }else if (!loadTimer){
          if (lazyTime <= 0){
            executeLoad()
          }else{
            loadTimer = setTimeout(()=>{ executeLoad() }, lazyTime)
          }
        }
      })
    }, {
      root: null,
      threshold: 0,
    })
    observer.observe(node)
    return ()=>{
      observer.unobserve(node)
      observer.disconnect()
      clear()
    }
  }
</script>

{#if !load}
  <span {@attach regLazy}>
    {@render children?.()}
  </span>
{:else}
  {#if loaded}
    {@render loaded()}
  {:else}
    {@render children?.()}
  {/if}
{/if}

<style>
  span{
    display: block;
    min-height: 1px;
  }
</style>
