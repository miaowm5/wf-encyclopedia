<script>
  import store from '../../store'

  const { character } = $props()

  const database = store.state.database.story_character
  const name = $derived.by(()=>{
    if (!database[character]){ return character }
    return database[character][0]
  })
  const color = $derived.by(()=>{
    if (!database[character]){ return '#7c8574' }
    return `#${database[character][1].slice(2)}`
  })
</script>

<div class="dialogName" style:background-color={color}>
  {name}
</div>

<style>
  .dialogName{
    color: white;
    padding: .2em .5em;
    font-size: .9em;
    max-width: 11em;
    margin-top: .8em;
    position: relative;
  }
  .dialogName::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 1em solid transparent;
    border-bottom: 1em solid transparent;
    border-right: 7px solid #fafafa;
  }
</style>
