<script>
  const { data, title } = $props()
  const url = $derived.by(()=>{
    return data.replace('encyclopedia/', '/resource/') + '.png'
  })
  document.title = title + ' | ' + import.meta.env.VITE_SITE_NAME
</script>

<img src="{url}" alt="banner">

<style>
  img {
    width: 100%;
  }
</style>
