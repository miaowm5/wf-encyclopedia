<script>
  import ContentInfo from './contentInfo.svelte'
  import ContentGallery from './contentGallery.svelte'
  import ContentVoice from './contentVoice.svelte'
  import ContentQuest from './contentQuest.svelte'

  const { tab, item, itemType } = $props()

</script>

{#if tab === 'info'}
  <ContentInfo item={item} />
{:else if tab === 'gallery'}
  <ContentGallery item={item} itemType={itemType} />
{:else if tab === 'voice'}
  <ContentVoice item={item} />
{:else if tab === 'story'}
  <ContentQuest item={item} itemType={itemType} />
{/if}
