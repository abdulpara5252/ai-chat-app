'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Reply, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment, SortOption } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CommentSystemProps {
  questionId: number;
}

export function CommentSystem({ questionId }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Load comments from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`comments-${questionId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const commentsWithDates = parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
      setComments(commentsWithDates);
    }
  }, [questionId]);

  // Save comments to localStorage
  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    localStorage.setItem(`comments-${questionId}`, JSON.stringify(updatedComments));
  };

  const addComment = (content: string, parentId: string | null = null) => {
    if (!content.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      questionId,
      content: content.trim(),
      author: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId,
      votes: 0,
    };

    saveComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const updateComment = (id: string, content: string) => {
    const updated = comments.map((c) =>
      c.id === id ? { ...c, content, updatedAt: new Date() } : c
    );
    saveComments(updated);
  };

  const deleteComment = (id: string) => {
    // Also delete all replies
    const deleteRecursive = (commentId: string): string[] => {
      const replies = comments.filter((c) => c.parentId === commentId);
      const idsToDelete = [commentId];
      replies.forEach((reply) => {
        idsToDelete.push(...deleteRecursive(reply.id));
      });
      return idsToDelete;
    };

    const idsToDelete = deleteRecursive(id);
    const updated = comments.filter((c) => !idsToDelete.includes(c.id));
    saveComments(updated);
  };

  const voteComment = (id: string, delta: number) => {
    const updated = comments.map((c) =>
      c.id === id ? { ...c, votes: c.votes + delta } : c
    );
    saveComments(updated);
  };

  // Build nested structure
  const buildCommentTree = (parentId: string | null = null): Comment[] => {
    return comments
      .filter((c) => c.parentId === parentId)
      .map((c) => ({
        ...c,
        replies: buildCommentTree(c.id),
      }));
  };

  const sortComments = (comments: Comment[]): Comment[] => {
    const sorted = [...comments].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'most-voted':
          return b.votes - a.votes;
        default:
          return 0;
      }
    });

    return sorted.map((c) => ({
      ...c,
      replies: c.replies ? sortComments(c.replies) : [],
    }));
  };

  const commentTree = sortComments(buildCommentTree());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Comments ({comments.length})
        </h3>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'newest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('newest')}
          >
            Newest
          </Button>
          <Button
            variant={sortBy === 'oldest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('oldest')}
          >
            Oldest
          </Button>
          <Button
            variant={sortBy === 'most-voted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('most-voted')}
          >
            Most Voted
          </Button>
        </div>
      </div>

      {/* New Comment Form */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={() => addComment(newComment)} disabled={!newComment.trim()}>
          Post Comment
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {commentTree.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={addComment}
            onEdit={updateComment}
            onDelete={deleteComment}
            onVote={voteComment}
            level={0}
          />
        ))}
        {commentTree.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onReply: (content: string, parentId: string) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onVote: (id: string, delta: number) => void;
  level: number;
}

function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  onVote,
  level,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent, comment.id);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    onDelete(comment.id);
    setShowDeleteConfirm(false);
  };

  const handleVote = (delta: number) => {
    if (delta === 1) {
      if (userVote === 'up') {
        setUserVote(null);
        onVote(comment.id, -1);
      } else if (userVote === 'down') {
        setUserVote('up');
        onVote(comment.id, 2);
      } else {
        setUserVote('up');
        onVote(comment.id, 1);
      }
    } else {
      if (userVote === 'down') {
        setUserVote(null);
        onVote(comment.id, 1);
      } else if (userVote === 'up') {
        setUserVote('down');
        onVote(comment.id, -2);
      } else {
        setUserVote('down');
        onVote(comment.id, -1);
      }
    }
  };

  const maxLevel = 4;
  const canReply = level < maxLevel;

  return (
    <div
      className={cn(
        'border-l-2 pl-4',
        level === 0 && 'border-l-0 pl-0',
        level > 0 && 'border-gray-300 dark:border-gray-700'
      )}
    >
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{comment.author}</span>
              <span>•</span>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
              {comment.updatedAt.getTime() !== comment.createdAt.getTime() && (
                <>
                  <span>•</span>
                  <span className="text-xs">(edited)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEdit}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{comment.content}</p>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleVote(1)}
            
            >
              <ThumbsUp className={cn(
                "h-4 w-4",
                userVote === 'up' ? "text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" : "text-gray-500 dark:text-gray-400"
              )} />
            </Button>
            <span className="text-sm font-medium min-w-[20px] text-center">
              {comment.votes}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleVote(-1)}
            >
              <ThumbsDown className={cn(
                "h-4 w-4",
                userVote === 'down' ? "text-red-600 dark:text-red-400 fill-red-600 dark:fill-red-400" : "text-gray-500 dark:text-gray-400"
              )} />
            </Button>
          </div>
          {canReply && !isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsReplying(!isReplying)}
              className="h-8"
            >
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 space-y-2">
            <p className="text-sm text-red-800 dark:text-red-200">
              Are you sure you want to delete this comment? This will also delete all replies.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                Yes, Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Reply form */}
        {isReplying && (
          <div className="space-y-2 pt-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReply}>
                Post Reply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onVote={onVote}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
