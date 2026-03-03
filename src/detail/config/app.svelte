<script>
  import { cdn } from '../../common'
  import { Title } from '../../ui'

  const { mode } = $props()

  const getDeviceType = ()=>{
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)){
      return "tablet"
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)){
      return "mobile"
    }
    return "desktop"
  }

  const getCDNInfo = ()=>{
    const list = ['cdn', 'cdn2', 'cdn3', 'cdn4']
    const useable = list.map((name)=>!cdn(name).startsWith('http'))
    const allSet = useable.every(v=>v)
    return { list, useable, allSet }
  }
</script>

{#snippet appCDNInfo(name, offline)}
  <div>
    <p>{name}</p>
    {#if offline}
      <p>use local data</p>
    {:else}
      <p>use online data</p>
    {/if}
  </div>
{/snippet}

{#if mode === 'web'}
  {#if getDeviceType() === 'desktop'}
    <Title>PC Version</Title>
    <a class="btn" href="/app/StarEncyclopedia-release.zip" download="StarEncyclopedia.zip">Download</a>
  {/if}
{:else if mode === 'app'}
  <Title>CDN Status</Title>
  {@const info = getCDNInfo()}
  {#each info.list as item, index}{@render appCDNInfo(item, info.useable[index])}{/each}
  {#if !info.allSet}
    <p>Download cdn file to enable offline function.</p>
    <button class="btn" onclick={()=>Neutralino.os.open('https://drive.google.com/drive/folders/10efVwEqhIKQWNRJBeJs1QxfrpWR7pDB7')}>Google Drive</button>
  {/if}
{:else if mode === 'pwa'}
  <!-- skip -->
{/if}

<style>
  .btn{
    padding: .5em 2em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
</style>
