export const setCaretToPosition = (element: HTMLElement, position: number) => {
  const range = document.createRange()
  const selection = window.getSelection()

  range.setStart(element.childNodes[0], position)
  range.collapse(true)

  if (selection) {
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export const saveSelection = () => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    return selection.getRangeAt(0)
  }
  return null
}

export const restoreSelection = (range: Range | null) => {
  if (range) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}
