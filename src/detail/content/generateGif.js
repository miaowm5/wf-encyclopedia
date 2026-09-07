import { GIFEncoder, quantize, applyPalette } from 'gifenc'

const TRANSPARENT_COLOR = [0, 255, 0]
const BG_COLOR = [255, 255, 255]

const generateGif = (movie, scale, speed, getImageCache)=>{
  const width = Math.round(movie.width * scale)
  const height = Math.round(movie.height * scale)
  const frames = []
  const colorMap = new Map()

  for (const [id, duration] of movie.timeline2) {
    const image = getImageCache(movie, id)

    if (!image) { continue }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(image.canvas, 0, 0, width, height)
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]
      const a = data[i + 3] / 255
      if (a === 0) {
        data[i] = TRANSPARENT_COLOR[0]
        data[i + 1] = TRANSPARENT_COLOR[1]
        data[i + 2] = TRANSPARENT_COLOR[2]
        data[i + 3] = 255
      }else{
        if (a > 0 && a < 1) {
          data[i]     = Math.round(r * a + BG_COLOR[0] * (1 - a))
          data[i + 1] = Math.round(g * a + BG_COLOR[1] * (1 - a))
          data[i + 2] = Math.round(b * a + BG_COLOR[2] * (1 - a))
          data[i + 3] = 255
        }
        r = data[i]
        g = data[i + 1]
        b = data[i + 2]
        const key = (r << 16) | (g << 8) | b
        if (!colorMap.has(key)){ colorMap.set(key, [r, g, b]) }
      }
    }
    frames.push({ data, duration })
  }

  const tooManyColors = colorMap.size > 255
  let palette
  if (!tooManyColors) {
    palette = Array.from(colorMap.values())
    palette.push(TRANSPARENT_COLOR)
  }else {
    let totalLength = 0
    for (const frame of frames) {
      const data = frame.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        if (
          r === TRANSPARENT_COLOR[0] &&
          g === TRANSPARENT_COLOR[1] &&
          b === TRANSPARENT_COLOR[2]
        ) {
          continue
        }

        totalLength += 4
      }
    }
    const allData = new Uint8Array(totalLength)
    let offset = 0
    for (const frame of frames) {
      const data = frame.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]
        if (
          r === TRANSPARENT_COLOR[0] &&
          g === TRANSPARENT_COLOR[1] &&
          b === TRANSPARENT_COLOR[2]
        ) {
          continue
        }
        allData[offset++] = r
        allData[offset++] = g
        allData[offset++] = b
        allData[offset++] = a
      }
    }
    palette = quantize(allData, 255)
    palette.push(TRANSPARENT_COLOR)
  }

  let exactColorIndex = null
  if (!tooManyColors) {
    exactColorIndex = new Map()
    for (let i = 0; i < palette.length; i++) {
      const color = palette[i]
      const key = (color[0] << 16) | (color[1] << 8) | color[2]
      exactColorIndex.set(key, i)
    }
  }
  const gif = GIFEncoder()

  for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
    const frame = frames[frameIndex]
    const data = frame.data
    let index
    if (!tooManyColors) {
      index = new Uint8Array(width * height)
      let pixelIndex = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const key = (r << 16) | (g << 8) | b
        const paletteIndex = exactColorIndex.get(key)
        if (paletteIndex === undefined) {
          console.warn('[gifenc] color not found in exact palette:', r, g, b)
          index[pixelIndex] = 0
        } else {
          index[pixelIndex] = paletteIndex
        }
        pixelIndex++
      }
    }else{
      index = applyPalette(data, palette)
    }
    const options = {
      palette,
      delay: Math.max(1, Math.round(frame.duration * speed)),
      repeat: 0,
      transparent: true,
      transparentIndex: palette.length - 1,
    }
    gif.writeFrame(index, width, height, options)
  }
  gif.finish()
  const bytes = gif.bytes()
  const blob = new Blob([bytes], { type: 'image/gif' })
  return blob
}

export default generateGif
