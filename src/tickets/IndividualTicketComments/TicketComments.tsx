import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { faClock, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import {
  AtSign,
  Bold,
  Clock,
  Image,
  Italic,
  List,
  ListOrdered,
  Smile,
  Strikethrough,
} from "lucide-react";
import { Underline as Uline } from "lucide-react";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { UseTickets } from "../hooks/UseTickets";

interface CommentsType {
  ticket_id: number;
  commented_by: number;
  comment_text: string;
  attachment_path: string;
  id: number;
  created_at: string;
  updated_at: string;
  entity_id: any;
}

interface ToolbarButtonProps {
  editor: any;
  command: string;
  label: string;
}
interface TicketCommentsProps {
  tktid: string;
}

const TicketCommnets = ({ tktid }: TicketCommentsProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [comments, setComments] = useState<CommentsType[]>([]);
  const textareaRef = useRef<HTMLDivElement | null>(null);

  const { GetTicketComments, CreateTicketComment } = UseTickets();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Add comments" }),
    ],
    content: "",
  });

  useEffect(() => {
    const allComments = async () => {
      console.log("tktid", tktid);
      const response = await GetTicketComments({ ticket_id: String(tktid) });
      console.log("comments", response);
      if (response.status) {
        setComments(response.data.data);
      }
    };
    allComments();
  }, []);

  console.log("comments", comments);

  // function ToolbarButton({ editor, command, label }: ToolbarButtonProps) {
  //   const isActive = () => {
  //     switch (command) {
  //       case "toggleBold":
  //         return editor.isActive("bold");
  //       case "toggleItalic":
  //         return editor.isActive("italic");
  //       case "toggleUnderline":
  //         return editor.isActive("underline");
  //       case "toggleBulletList":
  //         return editor.isActive("bulletList");
  //       case "toggleOrderedList":
  //         return editor.isActive("orderedList");
  //       default:
  //         return false;
  //     }
  //   };

  //   return (
  //     <button
  //       onClick={() => editor.chain().focus()[command]().run()}
  //       className={`px-2 py-1 border rounded cursor-pointer ${
  //         isActive() ? "bg-gray-700 text-white" : "bg-gray-50 text-black"
  //       }`}
  //     >
  //       {label}
  //     </button>
  //   );
  // }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(diff / 1000 / 60 / 24);

    if (days > 7) {
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (seconds >= 1) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };

  // const handleCommentSubmit = () => {
  //   if (newComment.trim()) {
  //     const comment = {
  //       id: String(Date.now()),
  //       author: "test user",
  //       avatar: "tu",
  //       content: newComment,
  //       timestamp: new Date().toISOString(),
  //       edited: false,
  //     };
  //     setComments((prev) => [...prev, comment]);
  //     setIsFocused(false), setNewComment("");
  //   }
  // };

  const handleSubmit = async () => {
    if (!editor) return;
    const html = editor.getHTML(); // get formatted content as HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editor.getHTML();
    const textContent = tempDiv.textContent || "";
    if (!textContent) {
      setIsFocused(false);
      return;
    }
    const comment = {
      ticket_id: Number(tktid),
      commented_by: 1,
      comment_text: html,
      attachment_path: "",
      // edited: false,
    };
    console.log(comment);
    const response = await CreateTicketComment(comment);

    console.log("response", response);
    if (response.status) {
      const response = await GetTicketComments({ ticket_id: String(tktid) });
      console.log("comments", response);
      if (response.status) {
        setComments(response.data.data);
      }
    }

    // setComments((prev) => [...prev, comment]);
    editor.commands.clearContent(); // reset editor
    setIsFocused(false);
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const htmlToText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleEditComment = (id: number) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;
    const plainText = htmlToText(comment.comment_text);
    setEditContent(plainText);
    setIsEditing(comment.id);
  };

  // const handleEditComment = (id: string) => {
  //   const comment = comments.find((comment) => comment.id === id);
  //   console.log("editcomment", comment);
  //   if (!comment) return;
  //   setEditContent(comment?.content);
  //   setIsEditing(comment.id);
  // };

  const handleSaveEditComment = (id: number) => {
    if (!editContent) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id == id
          ? {
              ...c,
              content: editContent,
              edited: c.comment_text !== editContent,
            }
          : c
      )
    );
    setIsEditing(null), setEditContent("");
  };

  const adjustTextareaHeight = (textareaRef: HTMLElement | null) => {
    // console.log("textarea", textareaRef);
    if (textareaRef) {
      textareaRef.style.height = "auto";
      // textareaRef.style.height = Math.min(textareaRef.scrollHeight, 200) + "px";
      textareaRef.style.maxHeight = "200px";
      textareaRef.style.overflowY =
        textareaRef.scrollHeight > 200 ? "auto" : "hidden";
    }
  };

  useEffect(() => {
    if (!editor) return;

    // textareaRef.current = editor.view.dom;
    adjustTextareaHeight(editor.view.dom);

    editor.on("update", () => {
      adjustTextareaHeight(editor.view.dom);
    });
  }, [editor]);

  return (
    <motion.div className="w-full  bg-gray-100 min-h-screen">
      <div className="w-full h-full bg-white shadow-sm border rounded-lg border-gray-200 p-2 mb-6">
        <div className="w-full h-full flex gap-5 flex-col">
          <div className="w-full h-full">
            {isFocused && (
              <div className="flex gap-2 mb-2 ">
                {/* <ToggleGroup type="single">
                  <ToggleGroupItem value="bold" className="cursor-pointer">
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" className="cursor-pointer">
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                 <ToggleGroupItem value="underline" className="cursor-pointer">
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem> 
                  <ToggleGroupItem value="strikeThrough" className="cursor-pointer">
                    <Strikethrough className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="listOrdered" className="cursor-pointer">
                    <ListOrdered className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" className="cursor-pointer">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="image" className="cursor-pointer">
                    <Image className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="atSign" className="cursor-pointer">
                    <AtSign className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="smile" className="cursor-pointer">
                    <Smile className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup> */}

                <ToggleGroup type="single" className="flex gap-2">
                  {/* Bold */}
                  <ToggleGroupItem
                    value="bold"
                    className={`p-2 rounded cursor-pointer ${
                      editor?.isActive("bold") ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                  >
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>

                  {/* Italic */}
                  <ToggleGroupItem
                    value="italic"
                    className={`p-2 rounded cursor-pointer ${
                      editor?.isActive("italic") ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                  >
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>

                  {/* Underline */}
                  <ToggleGroupItem
                    value="underline"
                    className={`p-2 rounded cursor-pointer ${
                      editor?.isActive("underline")
                        ? "bg-gray-700 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      editor?.chain().focus().toggleUnderline().run()
                    }
                  >
                    <Uline className="h-4 w-4" />
                  </ToggleGroupItem>

                  {/* Ordered List */}
                  <ToggleGroupItem
                    value="listOrdered"
                    className={`p-2 rounded cursor-pointer ${
                      editor?.isActive("orderedList")
                        ? "bg-gray-700 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                  >
                    <ListOrdered className="h-4 w-4" />
                  </ToggleGroupItem>

                  {/* Bullet List */}
                  <ToggleGroupItem
                    value="list"
                    className={`p-2 rounded cursor-pointer ${
                      editor?.isActive("bulletList")
                        ? "bg-gray-700 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                  >
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="strikeThrough"
                    className="cursor-pointer"
                  >
                    <Strikethrough className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="image" className="cursor-pointer">
                    <Image className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="atSign" className="cursor-pointer">
                    <AtSign className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="smile" className="cursor-pointer">
                    <Smile className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}
            {/* <Textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Add a comment..."
              rows={3}
              className="resize-none"
            /> */}
            <div>
              {isFocused ? (
                <EditorContent
                  editor={editor}
                  onFocus={() => setIsFocused(true)}
                  // ref={textareaRef}
                  className={cn(`tiptap-editor border-0 rounded-md cursor-pointer outline-none focus:outline-none focus:ring-0 [&_p]:min-h-14 [&_p]:rounded-md [&_p]:p-2 [&_p]:outline-none [&_p]:focus:outline-none [&_p]:focus:ring-0 [&_p]:border-0
                  `)}
                />
              ) : (
                <div
                  className="p-5 cursor-pointer "
                  onClick={() => setIsFocused(true)}
                >
                  Add a comment...
                </div>
              )}
            </div>
          </div>
          {isFocused && (
            <div className="w-full h-full flex items-center justify-end">
              <div className=" flex  gap-5">
                <Button
                  className=" bg-gray-100 hover:bg-bg-gray-100 text-gray-500 w-fit font-bold cursor-pointer"
                  onClick={() => {
                    setIsFocused(false);
                   
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  // disabled={!newComment.trim()}
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 w-fit font-bold cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* display Comments */}

      <div className="w-full h-full space-y-4">
        <h4 className="font-bold pl-5 capitalize">
          Comments ({comments.length})
        </h4>
        {[...comments].reverse().map((comment: CommentsType) => {
          return (
            <div
              className="flex gap-3 px-2 justify-center items-center"
              key={comment.id}
            >
              <div className="flex flex-col items-end">
                <span className="">
                  <Clock size={16} />
                </span>
                <span className="w-8 h-8 rounded-full bg-blue-600 flex justify-center items-center text-white uppercase font-bold shrink-0 text-sm">
                  {comment.commented_by}
                </span>
              </div>

              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-900 text-sm capitalize">
                        {comment.commented_by}
                      </span>
                      <span className="text-gray-500 ml-2 text-xs flex gap-1 justify-center items-center">
                        <span>{formatTimestamp(comment.updated_at)}</span>
                        {/* <span>{comment.edited && "(edited)"}</span> */}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <span
                        className="text-xs text-gray-500 hover:text-blue-500 px-2 py-2 cursor-pointer "
                        onClick={() => handleEditComment(comment.id)}
                      >
                        Edit
                      </span>
                      <span
                        className="text-xs text-gray-500 hover:text-red-500 px-2 py-2 cursor-pointer"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </span>
                    </div>
                  </div>
                  {isEditing === comment.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full resize-none border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none min-h-20"
                        autoFocus
                      />

                      <div className="flex justify-end gap-2">
                        <Button
                          className=""
                          variant={"outline"}
                          onClick={() => handleSaveEditComment(comment.id)}
                        >
                          Save
                        </Button>
                        <Button
                          className=""
                          variant={"outline"}
                          onClick={() => {
                            setIsEditing(null);
                            setEditContent("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // <p className=" text-bg-gray-600  whitespace-pre-wrap">
                    //   {comment.content}
                    // </p>
                    <div
                      className="px-1  rounded text-bg-gray-600  whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: comment.comment_text }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* {comments.map((comment, index) => (
          <div
            key={index}
            className="p-2 border rounded bg-gray-50"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        ))} */}
      </div>
    </motion.div>
  );
};

export default TicketCommnets;
