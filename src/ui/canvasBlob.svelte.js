import { onDestroy } from "svelte"

const empty = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`

const wrap = (canvas, emptySrc = empty)=>{
  let cancelFunc = false
  onDestroy(()=>{
    cancelFunc = true
    URL.revokeObjectURL(src)
  })
  let src = $state(emptySrc)
  if (canvas){
    canvas.toBlob((blob)=>{
      if (cancelFunc){ return }
      src = URL.createObjectURL(blob)
    })
  }
  return {
    get src(){ return src },
  }
}

export default wrap
