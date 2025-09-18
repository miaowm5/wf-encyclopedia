<script>
  import ContentInfo from './contentInfo.svelte'
  import ContentGallery from './contentGallery.svelte'
  import ContentVoice from './contentVoice.svelte'

  const { tab, item, itemType } = $props()

</script>

{#if tab === 'info'}
  <ContentInfo item={item} />
{:else if tab === 'gallery'}
  <ContentGallery item={item} itemType={itemType} />
{:else if tab === 'voice'}
  <ContentVoice item={item} itemType={itemType} />
{:else if tab === 'story'}
  <ContentGallery item={item} itemType={itemType} />
{/if}
