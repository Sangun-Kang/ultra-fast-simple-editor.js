import React, { useState, useRef } from "react"
import "../styles/editor.css"
import * as toolbar from "../utils/toolbar"

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
    { label: "Strike", command: "strikeThrough" },
  ]

  const handleCommand = (command: string) => {
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        if (command === "bold") {
          toolbar.bold(range)
        } else if (command === "italic") {
          toolbar.italic(range)
        } else if (command === "underline") {
          toolbar.underline(range)
        }
      }
    }
  }

  return (
    <div className="editor-container">
      <div className="toolbar">
        {toolbarButtons.map((button, index) => (
          <button key={index} onClick={() => handleCommand(button.command)}>
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
