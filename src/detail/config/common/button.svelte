<script>
  const { onclick, text, link, download } = $props()
</script>

{#if link}
  <a href={link} class="btn" target="_blank" rel="noopener noreferrer" download={download || ''} onclick={(e)=>{
    if (import.meta.env.VITE_APPMODE === 'app'){
      Neutralino.os.open(link)
      e.preventDefault()
    }
  }}>
    {text}
  </a>
{:else}
  <button class="btn" onclick={onclick}>{text}</button>
{/if}

<style>
  .btn{
    background: #fafafa;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
    cursor: pointer;
    color: #444444;
    text-decoration: none;
    display: block;
    padding: .5em 1em;
    border-top: 1px solid white;
    border-radius: 10px;
    margin-bottom: .5em;
    text-align: center;
    width: 100%;
  }
</style>
