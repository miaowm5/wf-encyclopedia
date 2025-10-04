<script>
  import { spriteSheet } from '../common'

  let {
    icon,
    title,
    onclick,
    active = false,
    alt,
  } = $props()

  const spriteIcon = $derived.by(()=>{
    return spriteSheet('res/icon', icon)
  })
</script>

<button
  aria-label={alt || title || icon}
  class={[active && 'active']}
  onclick={onclick}>
  <img
    src={spriteIcon.src}
    alt={alt || title || icon}
    class="icon"
    style:margin={title ? '.4em 0 -.5em 0' : 0}
  />
  {#if title}
    <span class="label">{title}</span>
  {/if}
</button>

<style>
  button{
    border-radius: 50%;
    width: 2.3em;
    height: 2.3em;
    margin-left: .3em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  button.active{
    box-shadow:
      inset 0 0 0px 3px #fdff00,
      0 0 5px 0px rgba(0,0,0,0.5),
      0 0 8px 3px #fdff00;
    cursor: default;
  }
  .icon {
    width: 130%;
    height: 130%;
  }
  .label {
    font-size: .8em;
    white-space: nowrap;
    text-shadow:
      -1px -1px 0 white,
      1px -1px 0 white,
      -1px  1px 0 white,
      1px  1px 0 white,
      0px  2px 0 white,
      2px  0px 0 white,
      -2px  0px 0 white,
      0px -2px 0 white;
  }
</style>
