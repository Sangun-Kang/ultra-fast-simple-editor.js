import React, { useState, useRef } from "react"
import Toolbar from "./Toolbar"
import { saveSelection, restoreSelection } from "../utils/setCaretToEnd"
import "../styles/editor.css"

const Editor = () => {
  const testHtmlData =
    '<div style="color: red;">Hello, World!</div><table><tr><td>1</td><td>2</td></tr></table>'
  const [content, setContent] = useState(testHtmlData)
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRange = useRef<Range | null>(null)

  const handleContentChange = (event: React.ChangeEvent<HTMLDivElement>) => {
    console.log(content)
    setContent(event.target.innerHTML)
    console.log(content)
  }

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html
      setContent(html)
    }
  }

  const toolbarButtons = [
    { label: "Bold", command: "bold" },
    { label: "Italic", command: "italic" },
    { label: "Underline", command: "underline" },
    { label: "Insert Image", command: "insertImage", isFileInput: true },
    { label: "Insert Link", command: "createLink" },
  ]
  const sabumit = () => {
    console.log(content)
  }
  return (
    <div className="editor-container">
      <button onClick={() => sabumit()}>test!</button>
      <Toolbar buttons={toolbarButtons} insertHTML={insertHTML} />
      <div
        ref={editorRef}
        contentEditable
        className="editor-content"
        dangerouslySetInnerHTML={{ __html: content }}
        onBlur={handleContentChange}
      ></div>
    </div>
  )
}

export default Editor
