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
  MessageSquareReply,
  Reply,
  Rss,
  Smile,
  Strikethrough,
} from "lucide-react";
import { Underline as Uline } from "lucide-react";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { UseTickets } from "../hooks/UseTickets";
import { toast } from "sonner";
import type { UsersDataType } from "../ticketInterfaces/TicketInterfaces";

interface CommentsType {
  ticket_id: number;
  user_id: number;
  comment_text: string;
  attachment_path: string;
  id: number;
  created_at: string;
  updated_at: string;
  entity_id: any;
  edited: boolean;
  parent_id: number;
}

interface ToolbarButtonProps {
  editor: any;
  command: string;
  label: string;
}
interface TicketCommentsProps {
  tktid: string;
  usersData: UsersDataType[];
}

const TicketCommnets = ({ tktid, usersData }: TicketCommentsProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isReplyEditing, setIsReplyEditing] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [comments, setComments] = useState<CommentsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [replyInput, setReplyInput] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [replayEditContent, setReplyEditContent] = useState<string>("");

  const {
    GetTicketComments,
    CreateTicketComment,
    DeleteTicketComment,
    EditTicketComment,
  } = UseTickets();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Add comments" }),
    ],
    content: "",
  });
  const allComments = async () => {
    const response = await GetTicketComments({ ticket_id: String(tktid) });
    console.log("comments", response);
    if (response.count > 0) {
      const coms = response.data.filter(
        (c: CommentsType) => String(c.ticket_id) === String(tktid)
      );
      setComments(coms);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    allComments();
  }, []);

  // console.log("comments", comments);

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
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

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
      user_id: 1,
      comment_text: html,
      parent_id: 0,
      // edited: false,
    };
    console.log(comment);
    const response = await CreateTicketComment(comment);

    console.log("response", response);
    if (response.status) {
      setLoading(true);
      await allComments();
    }

    // setComments((prev) => [...prev, comment]);
    editor.commands.clearContent(); // reset editor
    setIsFocused(false);
  };

  const handleDeleteComment = async (id: string) => {
    console.log("id", id);
    const res = await DeleteTicketComment({ comment_id: id });
    console.log("res", res);
    if (res.status) {
      setComments((prev) => prev.filter((c) => String(c.id) !== id));
    } else {
      toast.error(res.message);
    }
  };

  const htmlToText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleEditComment = (id: number) => {
    const comment = comments.find((c) => c.id === id);
    console.log("commentedit", comment);
    if (!comment) return;
    const plainText = htmlToText(comment.comment_text);

    if (comment.parent_id === 0) {
      setEditContent(plainText);
      setIsEditing(comment.id);
    } else {
      setReplyEditContent(plainText);
      setIsReplyEditing(comment.id);
    }
  };

  // const handleEditComment = (id: string) => {
  //   const comment = comments.find((comment) => comment.id === id);
  //   console.log("editcomment", comment);
  //   if (!comment) return;
  //   setEditContent(comment?.content);
  //   setIsEditing(comment.id);
  // };

  const handleSaveEditComment = async (id: number, editcnt: string) => {
    if (!editcnt) return;

    const editedComment = {
      comment_id: id,
      user_id: 1,
      comment_text: editcnt,
      attachment_path: "",
      edited: true,
    };

    const res = await EditTicketComment(editedComment);
    console.log("edited", res);
    if (res.status) {
      setLoading(true);
      setIsEditing(null), setEditContent("");
      setReplyEditContent(""), setIsReplyEditing(null);
      await allComments();
    } else {
      toast.error(res.message);
    }

    // setComments((prev) =>
    //   prev.map((c) =>
    //     c.id == id
    //       ? {
    //           ...c,
    //           content: editContent,
    //           edited: c.comment_text !== editContent,
    //         }
    //       : c
    //   )
    // );
  };

  const handleReplyToComment = async (cid: number) => {
    const comment = {
      ticket_id: Number(tktid),
      user_id: 1,
      comment_text: replyText,
      parent_id: cid,
      // edited: false,
    };
    setReplyText("");
    setReplyInput(null);

    const response = await CreateTicketComment(comment);

    console.log("response", response);
    if (response.status) {
      setLoading(true);
      await allComments();
    }
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
                  className={cn(`
                    
                    tiptap-editor
                    cursor-text
                    p-1
                    border-0 rounded-md outline-none focus:outline-none focus:ring-0
                    ring-0 focus:ring-0 focus-visible:ring-0
                    [&_.ProseMirror]:outline-none
                    [&_.ProseMirror]:border-0
                    [&_.ProseMirror]:ring-0
                    [&_.ProseMirror]:shadow-none
                    [&_p]:outline-none
                    [&_p]:border-0
                    [&_p]:ring-0
                    [&_p]:shadow-none
                    [&_p]:m-0
                    [&_p]:p-0

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
        {loading ? (
          <div className="text-center font-bold">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-center"> No comments</div>
        ) : (
          [...comments].reverse().map((comment: CommentsType) => {
            const user = usersData.find((u) => u.id === comment.user_id);
            const commentReplys = comments.filter(
              (c: CommentsType) => c.parent_id === comment.id
            );
            const deleted = comment.comment_text === "Comment deleted";

            if (!user || comment.parent_id > 0) return;
            // console.log('user',user)
            return (
              <div className="flex gap-3 px-2 justify-center " key={comment.id}>
                
                <div className="flex items-start">
                  <div className="flex flex-col items-end">
                    <span className="">
                      <Clock size={16} />
                    </span>
                    <span className="w-8 h-8 rounded-full bg-blue-600 flex justify-center items-center text-white uppercase font-bold shrink-0 text-sm">
                      {user.first_name.trim() === ""
                        ? user.email[0]
                        : `${user.first_name[0]}${user.last_name[0]}`}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                    {!deleted && (<div className="flex items-start justify-between mb-2">
                      
                      <div className="flex justify-center items-center">
                        <span className="text-gray-900 text-sm capitalize font-bold">
                          {user.first_name.trim() === ""
                            ? user.email
                            : `${user.first_name} ${user.last_name}`}
                        </span>
                        <span className="text-gray-500 ml-2 text-xs flex gap-1 justify-center items-center">
                          <span>{formatTimestamp(comment.updated_at)}</span>
                          <span>{comment.edited && "(edited)"}</span>
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
                            onClick={() =>
                              handleDeleteComment(String(comment.id))
                            }
                          >
                            Delete
                          </span>
                        </div>
                      
                    </div>)}

                    {isEditing === comment.id ? (
                      <div>
                        <textarea
                          value={editContent}
                          ref={textareaRef}
                          onChange={(e) => setEditContent(e.target.value)}
                          onFocus={(e) => {
                            const el = e.currentTarget;
                            // Move cursor to end only when focused
                            el.setSelectionRange(
                              el.value.length,
                              el.value.length
                            );
                          }}
                          className="w-full resize-none border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none min-h-10"
                          autoFocus
                        />

                        <div className="flex justify-end gap-2">
                          <Button
                            className=""
                            variant={"outline"}
                            onClick={() =>
                              handleSaveEditComment(comment.id, editContent)
                            }
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
                      <div
                        className={cn("px-1  rounded text-bg-gray-600  whitespace-pre-wrap",deleted ? "cursor-no-drop": "")}
                        dangerouslySetInnerHTML={{
                          __html: comment.comment_text,
                        }}
                      />
                    )}
                  </div>
                  <div className="p-1">
                    <Reply onClick={() => setReplyInput(comment.id)} />
                    {replyInput === comment.id && (
                      <div className="ml-20">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          // onFocus={(e) => {
                          //   const el = e.currentTarget;
                          //   // Move cursor to end only when focused
                          //   el.setSelectionRange(
                          //     el.value.length,
                          //     el.value.length
                          //   );
                          // }}
                          className="w-full resize-none border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none min-h-20"
                          autoFocus
                        />

                        <div className="flex justify-end gap-2">
                          <Button
                            className=""
                            variant={"outline"}
                            onClick={() => handleReplyToComment(comment.id)}
                          >
                            Save
                          </Button>
                          <Button
                            className=""
                            variant={"outline"}
                            onClick={() => {
                              setReplyInput(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {commentReplys.length > 0 &&
                      commentReplys.map((comReply) => {
                        const replyDelete = comReply.comment_text === "Comment deleted";
                        return (
                          <div
                            className="flex gap-3 px-2 py-1 justify-center items-center"
                            key={comReply.id}
                          >
                            <div className="flex flex-col items-end">
                              <span className="">
                                <Clock size={16} />
                              </span>
                              <span className="w-8 h-8 rounded-full bg-blue-600 flex justify-center items-center text-white uppercase font-bold shrink-0 text-sm">
                                {user.first_name.trim() === ""
                                  ? user.email[0]
                                  : `${user.first_name[0]}${user.last_name[0]}`}
                              </span>
                            </div>

                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                {!replyDelete && 
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex justify-center items-center">
                                    <span className="text-gray-900 text-sm capitalize font-bold">
                                      {user.first_name.trim() === ""
                                        ? user.email
                                        : `${user.first_name} ${user.last_name}`}
                                    </span>
                                    <span className="text-gray-500 ml-2 text-xs flex gap-1 justify-center items-center">
                                      <span>
                                        {formatTimestamp(comReply.updated_at)}
                                      </span>
                                      <span>
                                        {comReply.edited && "(edited)"}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    <span
                                      className="text-xs text-gray-500 hover:text-blue-500 px-2 py-2 cursor-pointer "
                                      onClick={() =>
                                        handleEditComment(comReply.id)
                                      }
                                    >
                                      Edit
                                    </span>
                                    <span
                                      className="text-xs text-gray-500 hover:text-red-500 px-2 py-2 cursor-pointer"
                                      onClick={() =>
                                        handleDeleteComment(String(comReply.id))
                                      }
                                    >
                                      Delete
                                    </span>
                                  </div>
                                </div>}

                                {/* <div
                                  className="px-1  rounded text-bg-gray-600  whitespace-pre-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: comReply.comment_text,
                                  }}
                                /> */}

                                {isReplyEditing === comReply.id ? (
                                  <div>
                                    <textarea
                                      value={replayEditContent}
                                      onChange={(e) =>
                                        setReplyEditContent(e.target.value)
                                      }
                                      onFocus={(e) => {
                                        const el = e.currentTarget;
                                        // Move cursor to end only when focused
                                        el.setSelectionRange(
                                          el.value.length,
                                          el.value.length
                                        );
                                      }}
                                      className="w-full resize-none border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none min-h-10"
                                      autoFocus
                                    />

                                    <div className="flex justify-end gap-2">
                                      <Button
                                        className=""
                                        variant={"outline"}
                                        onClick={() =>
                                          handleSaveEditComment(
                                            comReply.id,
                                            replayEditContent
                                          )
                                        }
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        className=""
                                        variant={"outline"}
                                        onClick={() => {
                                          setIsReplyEditing(null);
                                          setReplyEditContent("");
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={cn("px-1  rounded text-bg-gray-600  whitespace-pre-wrap ",replyDelete ? "cursor-not-allowed" : "")}
                                    dangerouslySetInnerHTML={{
                                      __html: comReply.comment_text,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default TicketCommnets;
