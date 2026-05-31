<script>
  import observer from './lazyloadObserver.js'
  const { load: loadFunc, lazy, children, lazyTime = 0 } = $props()

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

  $effect(()=>{ if (!lazy){ executeLoad() } })

  const regLazy = (node)=>{
    observer.add(node, (isIntersecting)=>{
      if (!isIntersecting){
        if (loadTimer){ clearTimeout(loadTimer); loadTimer = null }
      }else if (!loadTimer){
        if (lazyTime <= 0){
          executeLoad()
        }else{
          loadTimer = setTimeout(()=>{ executeLoad() }, lazyTime)
        }
      }
    })
    return ()=>{
      observer.remove(node)
      clear()
    }
  }
</script>

{#if !load}
  <span {@attach regLazy}>
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
