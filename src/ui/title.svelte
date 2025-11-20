<script>
  import { spriteSheet } from '../common'
  import iconCache from './spritesheetCache.js'

  let { children } = $props()
  const left = spriteSheet('res/icon', 'wf_ui_flipper_border_left', 'cdn', iconCache)
  const right = spriteSheet('res/icon', 'wf_ui_flipper_border', 'cdn', iconCache)
</script>

<div class="title">
  <div class="l" style:background-image={`url(${left.src})`}></div>
  <p>{@render children?.()}</p>
  <div class="r" style:background-image={`url(${right.src})`}></div>
</div>

<style>
  .title{
    text-align: center;
    display: flex;
    padding: 1em 0;
  }
  .title>p{
    padding: 0 .5em;
  }
  .title>div{
    flex: 1;
    background-size: auto 100%;
    background-repeat: no-repeat;
  }
  .l{ background-position: right; }
  .r{ background-position: left; }
</style>
