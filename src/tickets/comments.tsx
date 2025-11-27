import React, { useState, useRef, useEffect } from 'react';
import { Send, Bold, Italic, List, Link2, AtSign, X } from 'lucide-react';


interface CommentsType {
    id: number;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    edited: boolean;
}

export default function TicketCommnets() {
  const [comments, setComments] = useState<CommentsType[]>([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'JD',
      content: 'This looks great! Can we add more features?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      edited: false
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const formatTimestamp = (timestamp:string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs =  now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'Current User',
        avatar: 'CU',
        content: newComment,
        timestamp: new Date().toISOString(),
        edited: false
      };
      setComments([...comments, comment]);
      setNewComment('');
      setIsFocused(false);
    }
  };

  const handleEdit = (id:number) => {
    const comment = comments.find(c => c.id === id);
    if (!comment) return;  
    setIsEditing(id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (id:number) => {
    setComments(comments.map(c => 
      c.id === id 
        ? { ...c, content: editContent, edited: true }
        : c
    ));
    setIsEditing(null);
    setEditContent('');
  };

  const handleDelete = (id:number) => {
    setComments(comments.filter(c => c.id !== id));
  };

//   const handleKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>, isEdit = false) => {
//     if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
//       e.preventDefault();
//       if (isEdit && isEdit !== null) {
//         handleSaveEdit(isEditing!);
//       } else {
//         handleSubmit();
//       }
//     }
//   };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight(textareaRef.current);
  }, [newComment]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Task Title</h1>
        <p className="text-gray-600 mb-6">Add comments to collaborate with your team</p>

        {/* Comment Input Box */}
        <div className="mb-8">
          <div className={`border rounded-lg transition-all ${
            isFocused ? ' shadow-sm' : 'border-gray-300'
          }`}>
            {/* Toolbar */}
            {isFocused && (
              <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50">
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Bold">
                  <Bold size={16} className="text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Italic">
                  <Italic size={16} className="text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="List">
                  <List size={16} className="text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Link">
                  <Link2 size={16} className="text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Mention">
                  <AtSign size={16} className="text-gray-600" />
                </button>
              </div>
            )}

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsFocused(true)}
            //   onKeyDown={handleKeyDown}
              placeholder="Add a comment..."
              className="w-full px-4 py-3 resize-none focus:outline-none rounded-lg"
              style={{ minHeight: '60px', maxHeight: '200px' }}
            />

            {/* Action Buttons */}
            {isFocused && (
              <div className="flex items-center justify-end px-3 py-2 border-t border-gray-200 bg-gray-50">
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNewComment('');
                      setIsFocused(false);
                    }}
                    className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim()}
                    className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send size={14} />
                    Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Comments ({comments.length})
          </h3>
          
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              {/* Avatar */}
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                {comment.avatar}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTimestamp(comment.timestamp)}
                        {comment.edited && ' (edited)'}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(comment.id)}
                        className="text-xs text-gray-600 hover:text-blue-600 px-2 py-1 rounded hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-gray-600 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {isEditing === comment.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        // onKeyDown={(e) => handleKeyDown(e, true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none resize-none"
                        style={{ minHeight: '80px' }}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(null);
                            setEditContent('');
                          }}
                          className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}