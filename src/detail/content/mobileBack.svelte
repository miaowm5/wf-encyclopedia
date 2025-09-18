<script>
  import store from '../../store'
</script>

<div class="mobileBack">
  <button onclick={()=>{store.setListHide(false)}}>返回一览</button>
</div>

<style>
  .mobileBack{
    display: none;
    text-align: center;
  }
  .mobileBack>button{
    border-top: 1px solid white;
    border-radius: 10px;
    margin-bottom: 1em;
    padding: .6em 1.5em;
    display: inline-block;
  }
  @media (max-width: 800px) {
    .mobileBack{
      margin-top: 3em;
      display: block;
    }
  }
</style>
