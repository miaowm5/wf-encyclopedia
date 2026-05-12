
import { mount } from 'svelte'
import App from './src/index.svelte'
import { appInit } from './src/common/cdn'

if (import.meta.env.VITE_APPMODE === 'app'){
  (async ()=>{
    Neutralino.init()
    await Neutralino.server.mount('/cdn', NL_PATH + '/cdn');
    await appInit()
    mount(App, { target: document.body })
  })()
}else{
  mount(App, { target: document.body })
}
