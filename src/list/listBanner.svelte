<script>
  const { back, title, banner, content } = $props()
  const urlBack = `url(${import.meta.env.VITE_CDN}ui/${back}.png)`
  const urlTitle = `url(${import.meta.env.VITE_CDN}ui/${title}.png)`
</script>

<div class="main">
  <div class="header" style:background-image={urlBack}>
    {#if title}<div class="title" style:background-image={urlTitle}></div>{/if}
    {@render banner?.()}
  </div>
  <div class="content">{@render content?.()}</div>
</div>

<style>
  .main{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .content{
    flex: 7;
    overflow: auto;
    padding: 1.5em .5em 8em .5em;
  }
  .header{
    flex: 3;
    max-height: 556px;
    background-size: cover;
    background-position: center;
    position: relative;
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
