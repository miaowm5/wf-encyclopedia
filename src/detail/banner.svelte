<script>
  const { data } = $props()
  const url = $derived.by(()=>{
    return data.replace('encyclopedia/', '/resource/') + '.png'
  })
</script>

<img src="{url}" alt="banner">

<style>
  img {
    width: 100%;
  }
</style>
