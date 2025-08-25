

const main = (text, width, height, style = {})=>{
  const {
    color = 'white',
    background = '#000000',
    size = '36px',
  } = style
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  canvas.width = width
  canvas.height = height
  if (background){
    ctx.fillStyle = background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.font = `${size} sans-serif`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width)
  return canvas
}

export default main
