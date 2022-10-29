'use strict'
var gfilter
var gTextProperties = {
  fontSize: 40,
  font: 'Impact',
  fillColor: '#ffffff',
  strokeColor: '#000000',
  align: 'center',
  underline: false,
}

var gKeywordSearchCountMap = {
  funny: 12,
  cat: 16,
  baby: 2,
  happy: 5,
  crazy: 4,
  sarcastic: 33,
  sad: 11,
  animals: 1,
  politics: 3,
}

var gImgs = [
  { id: 1, url: 'img/1.jpg', keywords: ['funny', 'politics', 'crazy'] },
  { id: 2, url: 'img/2.jpg', keywords: ['cute', 'dogs', 'animals'] },
  { id: 3, url: 'img/3.jpg', keywords: ['baby', 'happy', 'dogs', 'animals'] },
  { id: 4, url: 'img/4.jpg', keywords: ['funny', 'cat', 'happy'] },
  { id: 5, url: 'img/5.jpg', keywords: ['funny', 'baby', 'crazy'] },
  { id: 6, url: 'img/6.jpg', keywords: ['funny', 'sarcastic'] },
  { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby', 'crazy'] },
  { id: 8, url: 'img/8.jpg', keywords: ['funny', 'sarcastic'] },
  { id: 9, url: 'img/9.jpg', keywords: ['funny', 'baby', 'crazy'] },
  { id: 10, url: 'img/10.jpg', keywords: ['funny', 'politics', 'crazy'] },
  { id: 11, url: 'img/11.jpg', keywords: ['sarcastic', 'love', 'sport'] },
  { id: 12, url: 'img/12.jpg', keywords: ['sarcastic'] },
  { id: 13, url: 'img/13.jpg', keywords: ['funny', 'sarcastic'] },
  { id: 14, url: 'img/14.jpg', keywords: ['crazy'] },
  { id: 15, url: 'img/15.jpg', keywords: ['funny', 'sarcastic'] },
  { id: 16, url: 'img/16.jpg', keywords: ['funny', 'sarcastic'] },
  { id: 17, url: 'img/17.jpg', keywords: ['funny', 'politics', 'crazy'] },
  { id: 18, url: 'img/18.jpg', keywords: ['sarcastic', 'cartoons'] },
]

var gMeme = {
  selectedImgId: 5,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'I sometimes eat Falafel',
      size: gTextProperties.fontSize,
      align: gTextProperties.align,
      color: gTextProperties.fillColor,
      underline: gTextProperties.underline,
    },
  ],
}

function updateMeme(text) {
  gMeme.lines[gMeme.selectedLineIdx].txt = text
  var txtToRender = gMeme.lines[gMeme.selectedLineIdx].txt
  return txtToRender
}

function resetTextProp() {
  gTextProperties = {
    fontSize: 40,
    font: 'Impact',
    fillColor: '#ffffff',
    strokeColor: '#000000',
    alignment: 'center',
  }
}

function addLine() {
  if (gMeme.lines.length >= 3) return
  gMeme.selectedLineIdx++
  gMeme.lines.push({
    txt: 'Your text here',
    size: gTextProperties.fontSize,
    align: gTextProperties.align,
    color: gTextProperties.fillColor,
  })
  // const input = document.getElementById('meme-text')

  // input.placeholder = ''
  // drawRect(gMeme.selectedLineIdx, 225, 40, center)
  renderMeme(gSelectedImg)
}

function deleteLine() {
  gMeme.lines[gMeme.selectedLineIdx].txt = ''
}

function alignRect(align, pos, width = 50) {
  let posX
  if (align === 'left') posX = pos
  else if (align === 'center') posX = pos - width / 2 - 10
  else if (align === 'right') posX = pos - width
  return posX
}

function alignUnderLine(LineIdx) {
  let posY
  switch (LineIdx) {
    case 0:
      posY = 63
      break
    case 1:
      posY = 403
      break
    case 2:
      posY = 228
      break
  }
  return posY
}
