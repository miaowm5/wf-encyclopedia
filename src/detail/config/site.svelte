<script>
  import store from '../../store'
  import { Title } from '../../ui'
  import Button from './common/button.svelte'

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
    <Title>{store.i18n("detail.config.appTitle3")}</Title>
    <Button
      link="/app/StarEncyclopedia-release.zip"
      text={store.i18n("detail.config.appDownload")}
      download="StarEncyclopedia.zip"
    />
  {/if}
{:else if mode === 'pwa'}
  <!-- skip -->
{/if}

<style>
</style>
