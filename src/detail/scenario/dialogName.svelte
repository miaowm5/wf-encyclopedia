<script>
  import store from '../../store'

  const { character } = $props()

  const loadDB = store.database('story_character')

  const name = $derived.by(()=>{
    if (!loadDB.finish){ return [character, '#7c8574'] }
    const database = loadDB.db.story_character
    if (!database[character]){ return [character, '#7c8574'] }
    return [database[character][0], `#${database[character][1].slice(2)}`]
  })
</script>

<div class="dialogName" style:background-color={name[1]}>
  {name[0]}
</div>

<style>
  .dialogName{
    color: white;
    padding: .2em 1em .2em .5em;
    font-size: .9em;
    min-width: 11em;
    margin-top: .8em;
    position: relative;
    display: inline-block;
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
