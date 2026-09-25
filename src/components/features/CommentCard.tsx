"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/app/(dashboard)/posts/dataOps";

interface CommentCardProps {
  comment_id: number;
  comment_content: String;
  author_name: String;
  author_picture: String;
  comment_createdAt: Date;
  ownerCheck: boolean;
  refresh: () => void;
}

//Refers to the card containing the details of a comment
//Displayed in the details of a post page
export function CommentCard({
  comment_id,
  comment_content,
  author_name,
  author_picture,
  comment_createdAt,
  ownerCheck,
  refresh
}: CommentCardProps) {
  const [deleteModal, showDeleteModal] = useState(false);

  const handleDelete = async () => {
    await deleteComment(comment_id);
    showDeleteModal(false);
    refresh();
  }

  return (
    <div>
      <Card className="relative overflow-hidden border border-slate-200 bg-white p-0 shadow-sm transition-shadow hover:shadow-md text-scarlet">
        <CardContent className="p-4">
          <CardTitle className="text-base font-bold text-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <img
                  src={author_picture.valueOf()}
                  alt="Profile"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="text-large font-medium">{author_name + " |"}</span>
                <span className="text-large font-medium">{"on " + comment_createdAt.toLocaleDateString()}</span>
              </div>

              {/* Option to delete comments is only available for post's owner */}
              {ownerCheck && (
                <Button onClick={() => showDeleteModal(true)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </Button>
              )}
            </div>
          </CardTitle>
          <div className="text-slate-900 mt-3">
            <p>{comment_content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Verification on if a comment should be deleted */}
      {deleteModal ?
        (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
            <div 
                className="w-full max-w-[400px] rounded-xl bg-white shadow-2xl flex flex-col p-8 items-center text-center"
            >
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
                Delete Comment
            </h3>
            
            <p className="text-slate-600 mb-8 text-sm">
                Once deleted, the comment will be gone forever.
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
