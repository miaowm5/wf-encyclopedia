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
  {#if icon}
    <img
      src={spriteIcon.src}
      alt={alt || title || icon}
      class="icon"
      style:margin={title ? '.4em 0 -.5em 0' : 0}
    />
  {/if}
  {#if title}
    <span class="label" data-title={title}>{title}</span>
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
    position: relative;
    z-index: 0;
  }
  .label::after{
    content: attr(data-title);
    -webkit-text-stroke: 3px white;
    white-space: nowrap;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
</style>
