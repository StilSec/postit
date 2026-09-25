"use client";

import { useState, useRef, useEffect } from "react";
import { CommentCard } from "@/components/features/CommentCard";
import { Button } from "@/components/ui/button";
import { Post, User, Comment, deletePost, addComment, getComments } from "@/app/(dashboard)/posts/dataOps";
import { useRouter } from "next/navigation";

//Displays the details of a singular post
export default function ManagePost({
  initialPost, 
  user,
  initialComments,
  ownerCheck
}: { initialPost: Post, user: User, initialComments: Comment[], ownerCheck: boolean }) {
  const [post, setPost] = useState<Post>(initialPost);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();
  const [deleteModal, showDeleteModal] = useState(false);

  //Checks if createdAt is the same value as updatedAt; Purely for UI purposes
  const dateCheck = (
    post.post_createdAt.getDate() == post.post_updatedAt.getDate() &&
    post.post_createdAt.getMonth() == post.post_updatedAt.getMonth() &&
    post.post_createdAt.getUTCFullYear() == post.post_updatedAt.getUTCFullYear()
  );

  //Method to handle the deletion of a post
  const handleDelete = async () => {
    setCommentText("");
    await deletePost(post.post_id);
    router.push(`/posts`);
    router.refresh();
  }

  //Method to handle the creation of a comment
  const handleComment = async () => {
    if(commentText.length > 1) {
      await addComment(post.post_id, commentText);
    }

    setCommentText("");
    refresh();
  }

  //Method to handle the editing a post; Redirects user to the 'editing' page
  const handleEdit = async () => {
    router.push(`/posts/editPost/` + post.post_id);
    router.refresh();
  }

  //Returns the user to the home page
  const handleBack = async () => {
    router.push(`/posts/`);
    router.refresh();
  }

  //Allows the textarea for the post's content to expand when necessary
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const scrollContainer = el.closest('.overflow-y-auto') as HTMLElement | null;
    const scrollPos = scrollContainer?.scrollTop ?? window.scrollY;

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;

    if (scrollContainer) {
        scrollContainer.scrollTop = scrollPos;
    } else {
        window.scrollTo(0, scrollPos);
    }
  }, [commentText]);

  //Gets and displays the new comments after a new comment was added
  async function refresh() {
    const newComments = await getComments(post.post_id);
    setComments(() => newComments);
  }

  //Main component for post page
  return (
    <div className="flex flex-col min-h-[80vh] space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-3 text-black">
        {/* Back button for returning to main page */}
        <Button
          className="flex items-center justify-center w-10 h-10 rounded-full border mb-2"
          onClick={handleBack}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="18,4 18,20 6,12" />
          </svg>
        </Button>

        <div className="text-black w-full">
          <img
            src={post.post_thumbnail.valueOf()}
            alt={"Image not loaded"}
            className="h-48 sm:h-64 w-full object-cover"
          />
          <div className="flex flex-wrap items-center justify-start gap-8 mt-5">
            <h2 className="text-6xl font-bold tracking-tight text-black">
              {post.post_title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <img
                src={user.user_picture.valueOf()}
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="text-large font-medium">{post.author_name}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            {(dateCheck) ? (
              <p className="italic">Created on {post.post_updatedAt.toLocaleDateString()}</p>
            ) : (
              <p className="italic">Created on {post.post_createdAt.toLocaleDateString()} -- Last updated on {post.post_updatedAt.toLocaleDateString()}</p>
            )}

            {/* Makes it so that only the owner of the post can perform the 'edit' and 'delete'
            operations on it */}
            {ownerCheck && (
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" onClick={handleEdit}>Edit</Button>
                <Button type="button" size="sm" onClick={() => showDeleteModal(true)}>Delete</Button>
              </div>
            )}
          </div>

          <div className="h-px bg-black my-1 mb-4" />

          <p className="leading-relaxed whitespace-pre-wrap">
            {post.post_content}
          </p>

          <div className="h-px bg-black my-5" />

          {/* Comments section */}
          <h2 className="text-3xl font-bold tracking-tight text-black mb-3">
            Comments
          </h2>

          <div className="w-full">
            <div className="grid grid-cols-1 gap-4">
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment ..."
                className="w-full h-20 p-3 border rounded-md text-sm resize-none bg-white"
              />
            </div>
            <Button className="w-full mt-1 mb-10" onClick={handleComment}>Comment</Button>
          </div>

            {/* Shows all comments; If no comments exist, returns an empty space
            with a 'No Comments' description */}
          {(comments.length > 0) ? (
            <div className="grid grid-cols-1 gap-6 grid-cols-1">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.comment_id}
                  comment_id={comment.comment_id}
                  comment_content={comment.comment_content}
                  author_name={comment.author_name}
                  author_picture={comment.author_picture}
                  comment_createdAt={comment.comment_createdAt}
                  ownerCheck={ownerCheck}
                  refresh={refresh}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[10vh] flex-col items-center justify-center text-center">
              <p className="mt-3 text-sm text-slate-500">No Comments</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for verification of post delete operation */}
      {deleteModal ?
        (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
            <div 
                className="w-full max-w-[400px] rounded-xl bg-white shadow-2xl flex flex-col p-8 items-center text-center"
            >
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
                Delete Post
            </h3>
            
            <p className="text-slate-600 mb-8 text-sm">
                Once deleted, the post will be gone forever.
            </p>
    
            <div className="flex justify-center gap-4 w-full">
                <Button onClick={handleDelete} size="sm">
                  Yes
                </Button>
                <Button onClick={() => {showDeleteModal(false)}} size="sm">
                  No
                </Button>
            </div>
            </div>
        </div>) : null}
    </div>
  );
}
