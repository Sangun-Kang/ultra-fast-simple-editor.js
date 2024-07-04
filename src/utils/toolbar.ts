// bold
export const bold = (range: Range) => {
  const newDom = document.createElement("b")
  return range.surroundContents(newDom)
}

// italic
export const italic = (range: Range) => {
  const newDom = document.createElement("i")
  return range.surroundContents(newDom)
}
// underline
export const underline = (range: Range) => {
  const newDom = document.createElement("u")
  return range.surroundContents(newDom)
}
