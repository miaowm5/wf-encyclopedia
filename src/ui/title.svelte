<script>
  let { children } = $props()
</script>

<div class="title">
  <div class="l" style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/flipper_border_left.png'})`}></div>
  <p>{@render children?.()}</p>
  <div class="r" style:background-image={`url(${import.meta.env.VITE_CDN + 'ui/flipper_border.png'})`}></div>
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
