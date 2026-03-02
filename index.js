
import { mount } from 'svelte'
import App from './src/index.svelte'

if (__APP_MODE__){
  (async ()=>{
    Neutralino.init()
    await Neutralino.server.mount('/cdn', NL_PATH + '/cdn');
    mount(App, { target: document.body })
  })()
}else{
  mount(App, { target: document.body })
}
