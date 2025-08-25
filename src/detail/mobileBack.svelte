<script>
  import store from '../store'
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
    background: #fafafa;
    border: none;
    border-top: 1px solid white;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
    border-radius: 10px;
    text-align: left;
    margin-bottom: 1em;
    padding: .6em 1.5em;
    cursor: pointer;
    display: inline-block;
    font-size: 1em;
    color: #555555;
  }
  @media (max-width: 800px) {
    .mobileBack{
      margin-top: 3em;
      display: block;
    }
  }
</style>
