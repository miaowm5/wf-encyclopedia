<script>
  let {
    route,
    href = '/',
    onclick = ()=>{},
    children,
  } = $props()

  const navigate = (event) => {
    route.domEvent(event, href)
    onclick()
  }
</script>

<a href={href} onclick={navigate}>{@render children?.()}</a>

<style>
  a{
    color: inherit;
    text-decoration: none;
  }
</style>
