<script>
  import store from '../../store'
  import { Title } from '../../ui'
  import appLogic from './app.js'

  const info = appLogic.getCDNInfo()
</script>

{#snippet appCDNInfo(name, offline)}
  <div>
    <p>{name}</p>
    {#if offline}
      <p>use local data</p>
    {:else}
      <p>use online data</p>
    {/if}
    <button class="btn"
      onclick={()=>store.setDialog('appAssetsCheck', { target: name, force: false }, true)}
    >
      refresh data
    </button>
  </div>
{/snippet}

<Title>CDN Status</Title>
{#each info.list as item, index}{@render appCDNInfo(item, info.useable[index])}{/each}

<style>
  .btn{
    padding: .5em 2em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
</style>
