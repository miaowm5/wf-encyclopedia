<script>
  import BannerTitle from './bannerTitle.svelte'
  import NormalTitle from './normalTitle.svelte'
  import CharacterTitle from './characterTitle.svelte'
  import NpcTitle from './npcTitle.svelte'

  const { item } = $props()

</script>

{#if item[0][4] === '0' || item[0][4] === '1'}
  <CharacterTitle data={item} />
{:else if item[0][4] === '2'}
  <NpcTitle
    name={item[0][17]}
    race={item[0][10]}
    gender={item[0][11]}
    cv={item[0][9]}
    banner={item[0][6]}
  />
{:else if item[0][4] === '3' || item[0][4] === '4'}
  <BannerTitle data={item[0][16]} title={item[0][17]} />
{:else}
  <NormalTitle title={item[0][17]} />
{/if}
