<script>
  import store from '../../store'
  const { data, title } = $props()
  const url = $derived.by(()=>{
    return data.replace('encyclopedia/', import.meta.env.VITE_CDN) + '.png'
  })
  document.title = title + ' | ' + store.i18n('main.sitename')
</script>

<div class="header" style:background-image={`url(${url})`}></div>

<style>
  .header {
    flex: 1;
    background-color: black;
    background-size: cover;
    background-position: center bottom;
    width: 100%;
    max-height: 20%;
  }
</style>
