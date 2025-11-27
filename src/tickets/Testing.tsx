import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

export default function Testing() {
  const [comments, setComments] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Add a comment..." }),
    ],
    content: "",
  });

  const [update, setUpdate] = useState(false);

  editor?.on("selectionUpdate", () => {
    setUpdate((prev) => !prev); // toggle to force re-render
  });

  console.log("editor", editor);

  if (!editor) return null;

  const handleSubmit = () => {
    if (!editor) return;
    const html = editor.getHTML(); // get formatted content as HTML
    setComments((prev) => [...prev, html]);
    editor.commands.clearContent(); // reset editor
  };

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => setUpdate((prev) => !prev);
    editor.on("selectionUpdate", handleUpdate);
    return () => {
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  return (
    <div className="w-full max-w-xl space-y-4 p-3 border rounded-md shadow-sm">
      {/* Toolbar */}
      <div className="flex gap-1 border-b pb-2">
        <ToolbarButton editor={editor} command="toggleBold" label="B" />
        <ToolbarButton editor={editor} command="toggleItalic" label="I" />
        <ToolbarButton editor={editor} command="toggleUnderline" label="U" />
        <ToolbarButton
          editor={editor}
          command="toggleBulletList"
          label="• List"
        />
        <ToolbarButton
          editor={editor}
          command="toggleOrderedList"
          label="1. List"
        />
      </div>

      {/* Editor */}
      <div className="border rounded p-2 min-h-[90px]">
        <EditorContent editor={editor} />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>

      {/* Render submitted comments */}
      <div className="space-y-2">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="p-2 border rounded bg-gray-50"
            dangerouslySetInnerHTML={{ __html: comment }}
          />
        ))}
      </div>
    </div>
  );
}

// Toolbar button component
interface ToolbarButtonProps {
  editor: any;
  command: string;
  label: string;
}

function ToolbarButton({ editor, command, label }: ToolbarButtonProps) {
  const isActive = () => {
    switch (command) {
      case "toggleBold":
        return editor.isActive("bold");
      case "toggleItalic":
        return editor.isActive("italic");
      case "toggleUnderline":
        return editor.isActive("underline");
      case "toggleBulletList":
        return editor.isActive("bulletList");
      case "toggleOrderedList":
        return editor.isActive("orderedList");
      default:
        return false;
    }
  };

  return (
    <button
      onClick={() => editor.chain().focus()[command]().run()}
      className={`px-2 py-1 border rounded ${
        isActive() ? "bg-gray-700 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {label}
    </button>
  );
}
