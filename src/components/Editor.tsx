import React, { useState, useRef } from "react"
import "../styles/editor.css"

const Editor = () => {
  const [content, setContent] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)

  const handleContentBlur = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
    }
    console.log(content)
  }

  const toolbarButtons = [
    { label: "Bold", command: "bold" },
    { label: "Italic", command: "italic" },
    { label: "Underline", command: "underline" },
  ]

  const generateUniqueId = () =>
    `marker-${Math.random().toString(36).substr(2, 9)}`

  const unwrapNode = (element: HTMLElement): void => {
    const parent = element.parentNode
    while (element.firstChild) {
      parent?.insertBefore(element.firstChild, element)
    }
    parent?.removeChild(element)
  }

  const createMarker = (id: string): HTMLElement => {
    const marker = document.createElement("span")
    marker.id = id
    marker.style.position = "absolute"
    marker.style.left = "-9999px"
    return marker
  }

  const removeMarker = (id: string) => {
    const marker = document.getElementById(id)
    if (marker) {
      marker.parentNode?.removeChild(marker)
    }
  }

  const getNodesInRange = (range: Range, markerIds: string[]): Node[] => {
    const nodes: Node[] = []
    const treeWalker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (range.intersectsNode(node)) {
            const parentElement = node.parentElement
            if (parentElement && markerIds.includes(parentElement.id)) {
              return NodeFilter.FILTER_REJECT
            }
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        },
      }
    )

    let currentNode = treeWalker.nextNode()
    while (currentNode) {
      nodes.push(currentNode)
      currentNode = treeWalker.nextNode()
    }

    return nodes
  }

  const applyStyleToSelection = (styleProperty: string, value: string) => {
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0)

        // 고유한 마커 ID 생성
        const startMarkerId = generateUniqueId()
        const endMarkerId = generateUniqueId()

        // 마커 생성
        const startMarker = createMarker(startMarkerId)
        const endMarker = createMarker(endMarkerId)

        // 마커를 선택 영역의 시작과 끝에 삽입
        const rangeClone = range.cloneRange()
        rangeClone.collapse(false)
        rangeClone.insertNode(endMarker)

        range.collapse(true)
        range.insertNode(startMarker)

        // 선택 영역을 마커를 포함하도록 확장
        const expandedRange = document.createRange()
        expandedRange.setStartAfter(startMarker)
        expandedRange.setEndBefore(endMarker)

        // 선택된 노드들을 가져오기 위해 range 업데이트
        const selectedNodes = getNodesInRange(expandedRange, [
          startMarkerId,
          endMarkerId,
        ])

        // 선택 영역의 스타일 적용 여부 판단
        let isEntireSelectionStyled = true
        selectedNodes.forEach((node) => {
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent?.trim() !== ""
          ) {
            const parentElement = node.parentElement

            // 마커 건너뛰기
            if (
              parentElement?.id === startMarkerId ||
              parentElement?.id === endMarkerId
            ) {
              return
            }

            const isStyled =
              parentElement && parentElement.style[styleProperty] === value

            if (!isStyled) {
              isEntireSelectionStyled = false
            }
          }
        })

        // 스타일 적용 또는 제거 결정
        const shouldRemoveStyle = isEntireSelectionStyled

        // 선택된 노드들에 스타일 적용 또는 제거
        selectedNodes.forEach((node) => {
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent?.trim() !== ""
          ) {
            const parentElement = node.parentElement

            // 마커 건너뛰기
            if (
              parentElement?.id === startMarkerId ||
              parentElement?.id === endMarkerId
            ) {
              return
            }

            if (shouldRemoveStyle) {
              // 스타일 제거
              parentElement.style[styleProperty] = ""
              if (!parentElement.getAttribute("style")) {
                unwrapNode(parentElement)
              }
            } else {
              // 스타일 적용
              const span = document.createElement("span")
              span.style[styleProperty] = value
              parentElement?.replaceChild(span, node)
              span.appendChild(node)
            }
          }
        })

        // 선택 영역 복원
        const newStartMarker = document.getElementById(startMarkerId)
        const newEndMarker = document.getElementById(endMarkerId)

        if (newStartMarker && newEndMarker) {
          const newRange = document.createRange()
          newRange.setStartAfter(newStartMarker)
          newRange.setEndBefore(newEndMarker)

          selection.removeAllRanges()
          selection.addRange(newRange)

          // 마커 제거
          removeMarker(startMarkerId)
          removeMarker(endMarkerId)
        }

        // 에디터에 포커스 유지
        editorRef.current.focus()
      }
    }
  }

  const handleCommand = (command: string) => {
    if (command === "bold") {
      applyStyleToSelection("fontWeight", "bold")
    } else if (command === "italic") {
      applyStyleToSelection("fontStyle", "italic")
    } else if (command === "underline") {
      applyStyleToSelection("textDecoration", "underline")
    }
  }

  return (
    <div className="editor-container">
      <div className="toolbar">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault() // 포커스 손실 방지
              handleCommand(button.command)
            }}
          >
            {button.label}
          </button>
        ))}
      </div>
      <button onClick={handleContentBlur}>onClick!</button>
      <div
        ref={editorRef}
        contentEditable
        className="editor-content"
        onBlur={handleContentBlur}
      ></div>
    </div>
  )
}

export default Editor
