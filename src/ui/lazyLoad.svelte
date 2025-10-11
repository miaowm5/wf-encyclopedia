<script>
  import { onMount } from "svelte"

  const { load: loadFunc, lazy, children } = $props()

  let node = $state(null)
  let load = $state(!lazy)
  let observer = null

  const clear = ()=>{
    if (!observer){ return }
    observer.disconnect()
    observer = null
  }
  if (!lazy){ loadFunc() }
  onMount(()=>{
    if (!lazy){ return }
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
