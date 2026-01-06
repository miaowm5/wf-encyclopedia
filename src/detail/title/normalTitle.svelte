<script>
  import store from '../../store'
  const { title } = $props();

  (()=>{document.title = title + ' | ' + store.i18n('main.sitename')})()
  const background = import.meta.env.VITE_CDN + 'ui/keyword_details_keyword_background.png'

</script>

<div class="header" style:background-image={`url(${background})`}><p>★ {title}</p></div>

<style>
  .header{
    flex: 1;
    background-color: black;
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
    padding: 0 .5em;
    text-align: center;
  }
</style>
