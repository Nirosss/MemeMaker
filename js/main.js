'use strict'
var gElCanvas
var gCtx
var gSelectedImg
var gSelectedSticker
var gIsforDownload = false
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

gElCanvas = document.getElementById('my-canvas')
gCtx = gElCanvas.getContext('2d')

function onInit() {
  gElCanvas = document.getElementById('my-canvas')
  gCtx = gElCanvas.getContext('2d')
  renderGallery()
  addListeners()
}

function renderGallery(images) {
  var images = images || getImages()
  var strHtml = images.map(
    (img) => `
    <article class="gallery-img">
    <img class="gallery-img grid-item" data-id="${img.id}" onclick="onImgClicked(this.getAttribute('data-id'))" src="meme-imgs-sqr/${img.id}.jpg" alt="">  
    </article>
    `
  )
  document.querySelector('.main-gallery.grid').innerHTML = strHtml.join('')
}

function onImgClicked(img) {
  document.querySelector('.main-gallery').setAttribute('hidden', true)
  renderMeme(img)
  document.querySelector('.image-editor').removeAttribute('hidden')
}

function onSwitchView(val) {
  if (val === 'gallery') {
    document.querySelector('.image-editor').setAttribute('hidden', true)
    document.querySelector('.main-gallery').removeAttribute('hidden')
    document.querySelector('.about').setAttribute('hidden', true)
    resetTextProp()
  }
  if (val === 'about') {
    document.querySelector('.image-editor').setAttribute('hidden', true)
    document.querySelector('.main-gallery').setAttribute('hidden', true)
    document.querySelector('.about').removeAttribute('hidden')
    resetTextProp()
  }
  if (val === 'memes') {
    document.querySelector('.image-editor').setAttribute('hidden', true)
    document.querySelector('.main-gallery').setAttribute('hidden', true)
    document.querySelector('.about').setAttribute('hidden', true)
    resetTextProp()
  }
}

function renderMeme(img, text = '') {
  gSelectedImg = img
  const meme = new Image()
  meme.src = `meme-imgs-sqr/${img}.jpg`
  //  meme.onload = () => {
  gCtx.drawImage(meme, 0, 0, gElCanvas.width, gElCanvas.height)
  if (gSelectedSticker) {
    var sticker = new Image()
    sticker.src = `img/stickers/${gSelectedSticker}`
    gCtx.drawImage(sticker, 380, 380, 65, 65)
  }
  drawText(gMeme.lines[gMeme.selectedLineIdx].txt)
  const input = document.getElementById('meme-text')
  input.placeholder = '' || gMeme.lines[gMeme.selectedLineIdx].txt
  // }
}

function onTextInput(text) {
  gIsforDownload = false
  renderMeme(gSelectedImg, updateMeme(text))
}

function drawText(text) {
  const { fontSize, font, fillColor, strokeColor, align, underline } =
    gTextProperties
  const [line1, line2, line3] = gMeme.lines
  let text1 = line1.txt
  let text2 = ''
  let text3 = ''
  if (gMeme.lines.length > 1) text2 = line2.txt
  if (gMeme.lines.length > 2) text3 = line3.txt
  // there should be a shorter way. todo give each line text prop
  gCtx.lineWidth = 2
  gCtx.font = `${fontSize}px ${font}`
  gCtx.strokeStyle = strokeColor
  gCtx.fillStyle = fillColor
  let { width } = gCtx.measureText(text)
  let pos = getPosition(align)
  gCtx.textAlign = align
  gCtx.fillText(text1, pos, 60)
  gCtx.strokeText(text1, pos, 60)
  gCtx.fillText(text2, pos, 400)
  gCtx.strokeText(text2, pos, 400)
  gCtx.fillText(text3, pos, 225)
  gCtx.strokeText(text3, pos, 225)
  if (underline) {
    let posY = alignUnderLine(gMeme.selectedLineIdx)
    if (align === 'left') gCtx.fillRect(pos, posY, width, 2)
    else if (align === 'center') gCtx.fillRect(pos - width / 2, posY, width, 2)
    else if (align === 'right') gCtx.fillRect(pos - width, posY, width, 2)
  }
  if (gIsforDownload) return
  drawRect(gMeme.selectedLineIdx, pos, width, fontSize, align)
}

function onFontChange(property, val = 0) {
  switch (property) {
    case 'fontSize':
      gTextProperties.fontSize += val
      renderMeme(gSelectedImg)
      break
    case 'underline':
      gTextProperties.underline = !gTextProperties.underline
      renderMeme(gSelectedImg)
      break
    case 'color':
      gTextProperties.fillColor = val
      renderMeme(gSelectedImg)
      break
    case 'left':
      gTextProperties.align = 'left'
      renderMeme(gSelectedImg)
      break
    case 'center':
      gTextProperties.align = 'center'
      renderMeme(gSelectedImg)
      break
    case 'right':
      gTextProperties.align = 'right'
      gMeme.lines[gMeme.selectedLineIdx].align = 'right' // todo Update all changes to line level
      renderMeme(gSelectedImg)
      break
    case 'font':
      gTextProperties.font = val
      renderMeme(gSelectedImg)
      break
  }
}

function onAddLine() {
  addLine()
  document.getElementById('meme-text').focus()
}

function onDeleteLine() {
  deleteLine()
  renderMeme(gSelectedImg)
}

function getPosition(alignment) {
  let posX
  switch (alignment) {
    case 'left':
      posX = 2
      break
    case 'center':
      posX = gElCanvas.width / 2
      break
    case 'right':
      posX = gElCanvas.width - 10
      break
  }
  return posX
}

function onSearch(text) {
  gfilter = text
  let images = gImgs
  if (gfilter) {
    images = gImgs.filter((image) =>
      image.keywords.includes(gfilter.toLowerCase())
    )
  }
  renderGallery(images)
}

function getImages() {
  let images = gfilter ? onSearch(gfilter) : gImgs
  return images
}

function onToggleLine() {
  const input = document.getElementById('meme-text')
  input.value = ''
  gMeme.selectedLineIdx === gMeme.lines.length - 1
    ? (gMeme.selectedLineIdx = 0)
    : gMeme.selectedLineIdx++
  input.placeholder = '' || gMeme.lines[gMeme.selectedLineIdx].txt
  renderMeme(gSelectedImg)
  document.getElementById('meme-text').focus()
}

function preventRefresh(ev) {
  ev.preventDefault()
}

function drawRect(lineIdx, pos, width, fontSize, align) {
  gCtx.strokeStyle = '#8ca9c5'
  switch (lineIdx) {
    case 0:
      gCtx.strokeRect(
        alignRect(align, pos, width),
        75,
        width + 2,
        -(fontSize + 20)
      )
      break
    case 1:
      gCtx.strokeRect(
        alignRect(align, pos, width),
        415,
        width + 2,
        -(fontSize + 20)
      )
      break
    case 2:
      gCtx.strokeRect(
        alignRect(align, pos, width),
        240,
        width + 2,
        -(fontSize + 20)
      )
      break
  }
}

function toggleMenu() {
  document.body.classList.toggle('menu-open')
}

function onAddSticker(sticker) {
  gSelectedSticker = sticker
  renderMeme(gSelectedImg)
}

function onDownloadCanvas(elLink) {
  // todo find a way to asynch it so render will finish before download
  gIsforDownload = true
  const data = getCanvasToDownload(1)
  elLink.href = data
  elLink.download = `your-meme.jpg`

  // gIsforDownload = false
  // renderMeme(gSelectedImg)
}

function test(something) {
  console.log(something)
}

// function addListeners() {
//   addMouseListeners()
//   addTouchListeners()
//   //Listen for resize ev
// }

// function addMouseListeners() {
//   gElCanvas.addEventListener('mousemove', onMove)
//   gElCanvas.addEventListener('mousedown', onDown)
//   gElCanvas.addEventListener('mouseup', onUp)
// }

// function addTouchListeners() {
//   gElCanvas.addEventListener('touchmove', onMove)
//   gElCanvas.addEventListener('touchstart', onDown)
//   gElCanvas.addEventListener('touchend', onUp)
// }

// function onDown(ev) {
//   console.log('Im from onDown')
//   //Get the ev pos from mouse or touch
//   const pos = getEvPos(ev)
//   if (!isCircleClicked(pos)) return
//    //Save the pos we start from
//   gStartPos = pos
//   document.body.style.cursor = 'grabbing'

// }

// function onMove(ev) {
//   console.log('Im from onMove')
//   const { isDrag } = getCircle()
//   if (!isDrag) return
//   const pos = getEvPos(ev)
//   //Calc the delta , the diff we moved
//   const dx = pos.x - gStartPos.x
//   const dy = pos.y - gStartPos.y
//   moveCircle(dx, dy)
//   //Save the last pos , we remember where we`ve been and move accordingly
//   gStartPos = pos
//   //The canvas is render again after every move
//   renderCanvas()

// }

// function onUp() {
//   console.log('Im from onUp')
//   setCircleDrag(false)
//   document.body.style.cursor = 'grab'
// }

// function getEvPos(ev) {

//   //Gets the offset pos , the default pos
//   let pos = {
//     x: ev.offsetX,
//     y: ev.offsetY
//   }
//   // Check if its a touch ev
//   if (TOUCH_EVS.includes(ev.type)) {
//     //soo we will not trigger the mouse ev
//     ev.preventDefault()
//     //Gets the first touch point
//     ev = ev.changedTouches[0]
//     //Calc the right pos according to the touch screen
//     pos = {
//       x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
//       y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
//     }
//   }
//   return pos
// }

function getCanvasToDownload(quality) {
  renderMeme(gSelectedImg)
  return gElCanvas.toDataURL('image/jpeg', quality)
}
