"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from "lucide-react";
import { useCallback } from "react";
import { div } from "framer-motion/client";

export default function RichTextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "",
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    const url = window.prompt("أدخل رابط:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-purple-200" : ""
          }`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-purple-200" : ""
          }`}
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("underline") ? "bg-purple-200" : ""
          }`}
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 1 }) ? "bg-purple-200" : ""
          }`}
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 2 }) ? "bg-purple-200" : ""
          }`}
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-purple-200" : ""
          }`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-purple-200" : ""
          }`}
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={setLink}
          className="p-2 rounded hover:bg-gray-200"
        >
          <LinkIcon size={18} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="prose max-w-none p-7" />
    </div>
  );
}
