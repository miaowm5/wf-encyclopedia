<script>

  let {
    finish = false,
    error = [],
    children,
  } = $props()

</script>

{#if error.length > 0}
  <p>{error[0]}</p>
{:else if finish}
  {@render children?.()}
{:else}
  <div class="container">
    <img class="loading" src={`${import.meta.env.VITE_CDN}favicon.png`} alt="loading">
    <p>Loading...</p>
  </div>
{/if}

<style>
  .container{
    width: 100%;
    text-align: center;
    padding-top: 2em;
  }
  .loading{
    display:inline-block;
    transform-origin: center bottom;
    animation: jump 1.2s ease-in-out infinite;
  }
  @keyframes jump{
    0%   { transform: translateY(0) scaleY(1); }
    25%  { transform: translateY(-40%) scaleY(1.02); }
    50%  { transform: translateY(0)  scaleY(0.95); }
    75%  { transform: translateY(0)  scaleY(1.02); }
    100% { transform: translateY(0)  scaleY(1); }
  }
  @media (prefers-reduced-motion: reduce){
    .loading { animation: none; transform: translateY(0); }
  }
</style>
