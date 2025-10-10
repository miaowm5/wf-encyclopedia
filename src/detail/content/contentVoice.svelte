<script>
  import { fade } from 'svelte/transition'
  import store from '../../store'
  import { spriteSheet } from '../../common'
  import { Title, Loading } from '../../ui'
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
    const database2 = store.state.database.character_speech_text
    const info = database[item[0][5]]
    const text = database2[item[0][6]] || {}
    if (!info){ return null }
    return {
      home: info.filter((item)=>item[0] === '0'),
      join: info.filter((item)=>item[0] === '2')[0],
      evolution: info.filter((item)=>item[0] === '1')[0],
      text,
    }
  })

  let voicePlayerItem = null
  let voicePlayer = $derived.by(()=>{
    if (voicePlayerItem){ voicePlayerItem.destory() }
    let newPlayer = loadVoice(item[0][6])
    voicePlayerItem = newPlayer
    return newPlayer
  })

  const voiceMarker = spriteSheet('res/icon', 'voice_volume3')
</script>

{#snippet voice(text, audio, commentText=false)}
  <button class="voice" onclick={()=>{ voicePlayer.play(audio) }}>
    {#if voicePlayer.playing && voicePlayer.playing[0] === audio}
      <span class="progress" style:width={`${voicePlayer.seek}%`} out:fade={{ duration: 500 }}></span>
      <span
        class="mark" out:fade={{ duration: 200 }}
        style:background-image={`url(${voiceMarker.src})`}
      ></span>
    {/if}
    <div class="text">
      {#each text.split('\n') as line}
        <p>{line}</p>
      {/each}
    </div>
    {#if commentText && data.text[audio]}
      <p class="comment">{data.text[audio]}</p>
    {/if}
  </button>
{/snippet}

<div class="content">
  {#if !loadState.finish}
    {#if loadState.error.length > 0}
      <p>{loadState.error[0]}</p>
    {:else}
      <Loading />
    {/if}
  {:else if data}
    <Title>{store.i18n("detail.content.title5")}</Title>
    {@render voice(data.join[3], data.join[4])}
    {@render voice(data.evolution[3], data.evolution[4])}
    <Title>{store.i18n("detail.content.title6")}</Title>
    {#each data.home as item}
      {@render voice(item[3], item[4])}
    {/each}
    <Title>{store.i18n("detail.content.title7")}</Title>
    {@render voice(store.i18n("detail.content.voice1"), 'battle/skill_ready', true)}
    {@render voice(store.i18n("detail.content.voice2"), 'battle/skill_0', true)}
    {@render voice(store.i18n("detail.content.voice3"), 'battle/skill_1', true)}
    {@render voice(store.i18n("detail.content.voice4"), 'battle/battle_start_0', true)}
    {@render voice(store.i18n("detail.content.voice5"), 'battle/battle_start_1', true)}
    {@render voice(store.i18n("detail.content.voice6"), 'battle/win_0', true)}
    {@render voice(store.i18n("detail.content.voice7"), 'battle/win_1', true)}
    {@render voice(store.i18n("detail.content.voice8"), 'battle/power_flip_0', true)}
    {@render voice(store.i18n("detail.content.voice9"), 'battle/power_flip_1', true)}
    {@render voice(store.i18n("detail.content.voice10"), 'battle/outhole_0', true)}
    {@render voice(store.i18n("detail.content.voice11"), 'battle/outhole_1', true)}
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
    display: inline-block;
    border: none;
    background: white;
    margin-bottom: 1em;
    text-align: left;
    padding: 1em 1.5em 1em 1em;
    border-radius: .3em;
    box-shadow: none;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .voice>.mark{
    position: absolute;
    right: 0;
    top: 0;
    width: 2em;
    height: 2em;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 0;
  }
  .voice>.progress{
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #ffcf8f;
    z-index: 0;
  }
  .voice>.text, .voice>.comment{
    position: relative;
    z-index: 1;
  }
  .voice>.comment{
    color: #888;
    font-size: .9em;
  }
</style>
