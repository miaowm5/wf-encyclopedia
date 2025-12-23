<script>
  import extarGallery from '../../database/extraGallery.json'
  import BannerTitle from './bannerTitle.svelte'
  import NormalTitle from './normalTitle.svelte'
  import CharacterTitle from './characterTitle.svelte'
  import NpcTitle from './npcTitle.svelte'

  const { item, itemType, tab, extra } = $props()

</script>

{#if itemType === 'character'}
  <CharacterTitle data={item} itemType={itemType} tab={tab} />
{:else if itemType === 'npc'}
  <NpcTitle
    name={item.title}
    race={item.race}
    gender={item.gender}
    cv={item.cv}
    banner={item.storyID}
    itemType={itemType}
    tab={tab}
  />
{:else if itemType === 'story'}
  {@const hasGallery = item.subType === 'main' || extarGallery[item.eventID]}
  <BannerTitle data={item.banner} title={item.title} tab={tab} gallery={hasGallery} extra={extra} />
{:else}
  <NormalTitle title={item.title} />
{/if}
