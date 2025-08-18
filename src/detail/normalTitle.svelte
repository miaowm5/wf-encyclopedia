<script>
  const { title } = $props()

  document.title = title + ' | ' + import.meta.env.VITE_SITE_NAME

</script>

<div class="header"><p>★ {title}</p></div>

<style>
  .header{
    flex: 1;
    background: url(/resource/ui/keyword_details_keyword_background.png);
    background-size: cover;
    background-position: center bottom;
    color: white;
    font-size: 1.5em;
    width: 100%;
    max-height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .header>p{
    margin-top: 1em;
  }
</style>
