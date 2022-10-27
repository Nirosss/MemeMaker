'use strict'
let gElCanvas
let gCtx
let gSelectedImg

gElCanvas = document.getElementById('my-canvas')
gCtx = gElCanvas.getContext('2d')

function onInit() {
  gElCanvas = document.getElementById('my-canvas')
  gCtx = gElCanvas.getContext('2d')
  renderGallery()
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

function test(that) {
  console.log(that)
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
    console.log(val)
    resetTextProp()
  }
}

function renderMeme(img, text = '') {
  gSelectedImg = img
  const meme = new Image()
  meme.src = `meme-imgs-sqr/${img}.jpg`
  meme.onload = () => {
    gCtx.drawImage(meme, 0, 0, gElCanvas.width, gElCanvas.height)
    drawText(gMeme.lines[gMeme.selectedLineIdx].txt)
    const input = document.getElementById('meme-text')
    input.placeholder = '' || gMeme.lines[gMeme.selectedLineIdx].txt
  }
}

function onTextInput(text) {
  renderMeme(gSelectedImg, updateMeme(text))
}

function drawText(text) {
  const { fontSize, font, fillColor, strokeColor, align, underline } =
    gTextProperties
  let text2 = ''
  let text3 = ''
  const [line1, line2, line3] = gMeme.lines
  let text1 = line1.txt
  if (gMeme.lines.length > 1) text2 = line2.txt
  if (gMeme.lines.length > 2) text3 = line3.txt
  // there should be a shorter way
  gCtx.lineWidth = 2
  gCtx.strokeStyle = strokeColor
  gCtx.fillStyle = fillColor
  gCtx.font = `${fontSize}px ${font}`
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
  drawRect(gMeme.selectedLineIdx, pos, width, fontSize, align)
}

function onFontChange(property, val = 0) {
  console.log(property)
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
  }
}

function onAddLine() {
  addLine()
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
      posX = gElCanvas.width - 2
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
  gMeme.selectedLineIdx === gMeme.lines.length - 1
    ? (gMeme.selectedLineIdx = 0)
    : gMeme.selectedLineIdx++
  const input = document.getElementById('meme-text')
  input.value = gMeme.lines[gMeme.selectedLineIdx].txt
  input.placeholder = gMeme.lines[gMeme.selectedLineIdx].txt
  renderMeme(gSelectedImg)
}

function preventRefresh(ev) {
  ev.preventDefault()
}

function drawRect(lineIdx, pos, width, fontSize, align) {
  gCtx.strokeStyle = 'white'
  switch (lineIdx) {
    case 0:
      gCtx.strokeRect(
        alignRect(align, pos, width),
        80,
        width + 20,
        -(fontSize + 20)
      )
      break
    case 1:
      gCtx.strokeRect(
        alignRect(align, pos, width),
        420,
        width + 20,
        -(fontSize + 20)
      )
      break
    case 2:
      gCtx.strokeRect(
        alignRect(align, pos, width),
        245,
        width + 20,
        -(fontSize + 20)
      )
      break
  }
}
