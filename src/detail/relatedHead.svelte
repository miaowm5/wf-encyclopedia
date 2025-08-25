<script>
  import { headIcon } from '../common'

  const { name, file } = $props()

  const icon = $derived.by(()=>{
    return headIcon(name, file)
  })

</script>

<div class="border1"><div class="border2">
  <img src={icon.src} alt={name} />
</div></div>

<style>
  .border2{
    border: 1px solid #ababab;
    background-color: #232223;
  }
  .border1{
    border: 4px solid white;
  }
  img{ width: 100% }
</style>
