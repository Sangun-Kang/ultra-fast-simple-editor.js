import React, { useState, useRef } from "react"
import "../styles/editor.css"

const Editor = () => {
  const [content, setContent] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)

  const handleContentChange = () => {
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

  return (
    <div className="editor-container">
      <button onClick={handleContentChange}>onClick!</button>
      <div
        ref={editorRef}
        contentEditable
        className="editor-content"
        onBlur={handleContentChange}
      ></div>
    </div>
  )
}

export default Editor
