<script>
  import { MusicItem } from '../../ui'

  const { database, path } = $props()

  const list = $derived.by(()=>{
    if (!database){ return null }
    let p = path.album.split('-')
    let album = database
    p.forEach((t)=>{
      if (!album){ return null }
      album = album[t]
    })
    if (!album){ return null }
    if (!Array.isArray(album)){ return null }
    if (!path.name){ return album }
    let target = album.find((item)=>item.name === path.name)
    if (!target){ return null }
    return [target]
  })
</script>

{#if list}
  <div class="list">{#each list as item}
    <MusicItem item={item} />
  {/each}</div>
{/if}

<style>
  .list{
    border-radius: .3em;
    background-color: white;
    padding: .5em 0;
    margin-top: 1em;
  }
</style>
