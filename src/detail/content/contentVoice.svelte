<script>
  import store from '../../store'
  import { Title } from '../../ui'
  import MobileBack from './mobileBack.svelte'
  import loadData from './loadVoice.svelte.js'
  import loadVoice from './loadVoiceAudio.svelte.js'

  const { item } = $props()

  const loadState = loadData()
  const data = $derived.by(()=>{
    if (!loadState.finish){ return null }
    if (loadState.error.length > 0){ return null }
    if (!store.state.database.character_speech){ return null }
    const database = store.state.database.character_speech
    const info = database[item[0][5]]
    if (!info){ return null }
    return {
      home: info.filter((item)=>item[0] === '0'),
      join: info.filter((item)=>item[0] === '2')[0],
      evolution: info.filter((item)=>item[0] === '1')[0],
    }
  })
  let voicePlayer = null
  $effect(()=>{
    if (voicePlayer){ voicePlayer.destory() }
    voicePlayer = loadVoice(item[0][6])
  })
</script>

{#snippet voice(text, audio)}
  <button class="voice" onclick={()=>{
    voicePlayer.play(audio)
  }}>{text}</button>
{/snippet}

<div class="content">
  {#if !loadState.finish}
    {#if loadState.error.length > 0}
      <p>{loadState.error[0]}</p>
    {:else}
      <p>loading...</p>
    {/if}
  {:else if data}
    <Title>加入/进化</Title>
    {@render voice(data.join)}
    {@render voice(data.evolution)}
    <Title>主界面</Title>
    {#each data.home as item}
      {@render voice(item[3], item[4])}
    {/each}
    <Title>其他</Title>
    {@render voice('技能准备完成', 'battle/skill_ready')}
    {@render voice('技能发动1', 'battle/skill_0')}
    {@render voice('技能发动2', 'battle/skill_1')}
    {@render voice('战斗开始1', 'battle/battle_start_0')}
    {@render voice('战斗开始2', 'battle/battle_start_1')}
    {@render voice('胜利1', 'battle/win_0')}
    {@render voice('胜利2', 'battle/win_1')}
    {@render voice('强力弹射1', 'battle/power_flip_0')}
    {@render voice('强力弹射2', 'battle/power_flip_1')}
    {@render voice('落下1', 'battle/outhole_0')}
    {@render voice('落下2', 'battle/outhole_1')}
  {/if}
  <MobileBack />
</div>

<style>
  .content{
    flex: 1;
    padding: 0 1em 6em 1em;
    overflow: auto;
  }
  .voice{
    display: inline;
    border: none;
    background: white;
    margin-bottom: 1em;
  }
</style>
