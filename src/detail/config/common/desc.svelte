<script>
  const { text } = $props()
</script>

<div class="desc">{#each text.split('\n') as line}
  <p>{line}</p>
{/each}</div>

<style>
  .desc{
    display: block;
    margin-bottom: .5em;
    border-radius: 10px;
    padding: 1em;
    background-color: white;
  }
  .desc>p{
    min-height: 1em;
  }
</style>
