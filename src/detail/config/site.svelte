<script>
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

  const device = getDeviceType()
</script>

{#if mode === 'web'}
  {#if device === 'desktop'}
    <Title>PC Version</Title>
    <a class="btn" href="/app/StarEncyclopedia-release.zip" download="StarEncyclopedia.zip">Download</a>
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
