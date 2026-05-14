<script>
  import { cdn } from '../common'
  let { dialog = false, list = false } = $props()
</script>

<span class="main" class:dialog={dialog} class:list={list} style:background-image={`url('${cdn('cdn', 'ui/circle.png')}')`}></span>

<style>
  .main {
    z-index: -1;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 90%;
    aspect-ratio: 1 / 1;
    height: auto;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    animation: rotate-magic 25s linear infinite;
    pointer-events: none;
  }
  .main.dialog{
    opacity: 0.6;
    width: 70%;
    transform: translate(-50%, 60%);
    animation: rotate-magic2 25s linear infinite;
  }
  .main.list{ display: none; }
  @media (max-width: 800px){ .main.list{ display: inline; } }
  @keyframes rotate-magic {
    from { transform: translate(-50%, 50%) rotate(0deg); }
    to { transform: translate(-50%, 50%) rotate(360deg); }
  }
  @keyframes rotate-magic2 {
    from { transform: translate(-50%, 60%) rotate(0deg); }
    to { transform: translate(-50%, 60%) rotate(360deg); }
  }
</style>
