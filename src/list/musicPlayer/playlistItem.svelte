<script>
  const { title, play, remove, active } = $props()

  const songName = $derived.by(()=>{
    if (!title){ return ['',''] }
    let parts = title.split('/')
    let file = parts.pop()
    return [file.slice(0, file.length - 4), parts.join('/')]
  })
</script>

{#if songName[0]}
<div>
  <span>{songName[0]}</span>
  <span>{songName[1]}</span>
  {#if active}
    <span>（正在播放）</span>
  {:else}
    <button onclick={()=>play(title)}>播放</button>
  {/if}
  <button onclick={()=>remove(title)}>移除</button>
</div>
{/if}

<style></style>
