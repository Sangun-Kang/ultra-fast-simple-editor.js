import React, { useRef } from "react"

interface ToolbarProps {
  buttons: Array<{ label: string; command: string; isFileInput?: boolean }>
  insertHTML: (html: string) => void
}

const Toolbar: React.FC<ToolbarProps> = ({ buttons, insertHTML }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCommand = (command: string) => {
    document.execCommand(command)
  }

  const handleImageUpload = () => {
    const fileInput = fileInputRef.current
    if (fileInput) {
      fileInput.click()
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.src = e.target?.result as string
        img.alt = file.name
        document.execCommand("insertHTML", false, img.outerHTML)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInsertHTML = () => {
    const html = prompt("Enter HTML")
    if (html) {
      insertHTML(html)
    }
  }

  return (
    <div className="toolbar">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() =>
            button.isFileInput
              ? handleImageUpload()
              : handleCommand(button.command)
          }
        >
          {button.label}
        </button>
      ))}
      <button onClick={handleInsertHTML}>Insert HTML</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </div>
  )
}

export default Toolbar
