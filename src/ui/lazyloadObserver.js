
const callbacks = new Map()
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const el = entry.target
    const callback = callbacks.get(el);
    if (callback){ callback(entry.isIntersecting) }
  })
}, { root: null, threshold: 0 })

const add = (el, callback)=>{
  callbacks.set(el, callback)
  observer.observe(el)
}
const remove = (el)=>{
  callbacks.delete(el)
  observer.unobserve(el)
}

export default { add, remove }
