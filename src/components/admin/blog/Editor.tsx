"use client";

import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";

function MenuBar() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive("bold")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${
          editor.isActive("italic")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded ${
          editor.isActive("strike")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-2 rounded ${
          editor.isActive("code")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Code
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="p-2 rounded bg-white dark:bg-gray-800"
      >
        Clear marks
      </button>
      <button
        onClick={() => editor.chain().focus().clearNodes().run()}
        className="p-2 rounded bg-white dark:bg-gray-800"
      >
        Clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded ${
          editor.isActive("paragraph")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 3 })
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 4 })
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 5 })
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 6 })
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        H6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${
          editor.isActive("bulletList")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${
          editor.isActive("orderedList")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded ${
          editor.isActive("codeBlock")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded ${
          editor.isActive("blockquote")
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded bg-white dark:bg-gray-800"
      >
        Horizontal rule
      </button>
      <button
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className="p-2 rounded bg-white dark:bg-gray-800"
      >
        Hard break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded bg-white dark:bg-gray-800"
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded bg-white dark:bg-gray-800"
      >
        Redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={`p-2 rounded ${
          editor.isActive("textStyle", { color: "#958DF1" })
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        Purple
      </button>
    </div>
  );
}

const Editor = ({ field }) => {
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
  ];

  return (
    <div className="p-2 border border-gray-100 rounded min-h-[300px]">
      <EditorProvider
        slotBefore={<MenuBar />}
        immediatelyRender={false}
        extensions={extensions}
        content={field?.value}
        enableCoreExtensions={true}
        onUpdate={({ editor }) => {
          field.onChange(editor.getHTML());
        }}
      ></EditorProvider>
    </div>
  );
};

export default Editor;
