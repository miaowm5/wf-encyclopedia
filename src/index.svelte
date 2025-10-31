<script>
  import './reset.css'
  import List from './list/index.svelte'
  import Dialog from './dialog/index.svelte'
  import Detail from './detail/index.svelte'
</script>

<div class="main">
  <div class="content">
    <List />
    <Detail />
  </div>
  <Dialog />
</div>

<style>
  .main{
    display: flex;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
  .content{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    margin: 0 auto;
    max-width: 1280px;
    gap: 3px;
  }
</style>
