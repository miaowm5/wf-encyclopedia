<script>
  import BannerTitle from './bannerTitle.svelte'
  import NormalTitle from './normalTitle.svelte'
  import CharacterTitle from './characterTitle.svelte'
  import NpcTitle from './npcTitle.svelte'

  const { item, itemType, tab } = $props()

</script>

{#if itemType === 'character'}
  <CharacterTitle data={item} itemType={itemType} tab={tab} />
{:else if itemType === 'npc'}
  <NpcTitle
    name={item[0][17]}
    race={item[0][10]}
    gender={item[0][11]}
    cv={item[0][9]}
    banner={item[0][6]}
    itemType={itemType}
    tab={tab}
  />
{:else if itemType === 'story'}
  <BannerTitle data={item[0][16]} title={item[0][17]} tab={tab} />
{:else}
  <NormalTitle title={item[0][17]} />
{/if}
