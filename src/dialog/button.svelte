<script>
  const {
    children,
    onclick,
    disabled = false,
    type = 'default'
  } = $props()
</script>

<button
  onclick={disabled ? undefined : onclick}
  class:ok={type === 'ok'}
  class:cancel={type === 'cancel'}
  disabled={disabled}
>
  {@render children()}
</button>

<style>
  /* [TODO] update style */
  button{
    padding: .5em 3em;
    color: white;
    border-radius: .5em;
    background-color: #fafafa;
    border: none;
  }
  button.cancel{
    background-color: #e93551;
    border: 2px solid #f04064;
  }
  button.cancel:disabled{
    background-color: #e93551;
    border: 2px solid #f04064;
  }
  button.ok{
    background-color: #2dc4b6;
    border: 2px solid #38d0c6;
  }
  button.ok:disabled{
    background-color: #2dc4b6;
    border: 2px solid #38d0c6;
  }
</style>
