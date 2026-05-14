<script>
  const { header, content, submit } = $props()
</script>

<div class="header">{@render header()}</div>
<div class="content">{@render content()}</div>
<div class="submit">{@render submit()}</div>

<style>
  .content{
    flex: 1;
    overflow: auto;
    padding: 0 .5em 1.5em;
  }
  .header{
    text-align: center;
    padding: 0 0 .8em;
    border-bottom: 2px solid #dedede;
  }
  .submit{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    border-top: 2px solid #dedede;
    padding-top: 1em;
    gap: .5em 1em;
    padding-bottom: .5em;
  }
</style>
