<script>
  const { back, title, children, } = $props()
  const urlBack = `url(${import.meta.env.VITE_CDN}ui/${back}.png)`
  const urlTitle = `url(${import.meta.env.VITE_CDN}ui/${title}.png)`
</script>

<div class="header" style:background-image={urlBack}>
  {#if title}<div class="title" style:background-image={urlTitle}></div>{/if}
  {@render children?.()}
</div>

<style>
  .header{
    height: 556px;
    max-height: 30%;
    background-size: cover;
    background-position: center;
    position: relative;
    margin-bottom: 2em;
  }
  .title{
    position: absolute;
    left: 30%;
    right: 30%;
    top: 0;
    bottom: 0;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
