<script>
  import store from '../../store'
  import appLogic from './app.js'
</script>

<button class="btn" onclick={()=>store.setAppUpdater(null)}>back</button>

<style>
  .btn{
    padding: .5em 2em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-right: .5em;
    margin-bottom: .5em
  }
</style>
