<script>
  import ContentInfo from './contentInfo.svelte'
  import ContentGallery from './contentGallery.svelte'
  import ContentGallery2 from './contentGallery2.svelte'
  import ContentVoice from './contentVoice.svelte'
  import ContentQuest from './contentQuest.svelte'

  const { tab, item, itemType } = $props()

</script>

{#if tab === 'info'}
  <ContentInfo item={item} />
{:else if tab === 'gallery'}
  {#if itemType === 'story'}
    <ContentGallery2 item={item} />
  {:else}
    <ContentGallery item={item} itemType={itemType} />
  {/if}
{:else if tab === 'voice'}
  <ContentVoice item={item} />
{:else if tab === 'story'}
  <ContentQuest item={item} itemType={itemType} />
{/if}
