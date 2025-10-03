<script>
  import { onMount } from "svelte"

  const { load: loadFunc, lazy } = $props()

  let node = $state(null)
  let load = $state(!lazy)
  let observer = null

  const clear = ()=>{
    if (!observer){ return }
    observer.disconnect()
    observer = null
  }
  onMount(()=>{
    if (!lazy){
      loadFunc()
      return
    }
    observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if (!entry.isIntersecting){ return }
        load = true
        loadFunc()
        clear()
      })
    }, {
      root: null,
      threshold: 0,
    })
    return clear
  })

  let lastNode = null
  $effect(()=>{
    if (!observer){ return }
    if (!node){ return }
    observer.observe(node)
    if (lastNode){ observer.unobserve(lastNode) }
    lastNode = node
  })

</script>

{#if !load}
  <span bind:this={node}></span>
{/if}

<style>
  span{
    display: block;
    height: 1px;
  }
</style>
