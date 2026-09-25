"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post_id: number;
  post_title: String;
  post_summary: String;
  post_thumbnail: String;
  author_name: String;
  post_createdAt: Date;
  post_updatedAt: Date;
}

//Refers to the clickable card containing the details of a post
//Displayed in the dashboard or main posts page
export function PostCard({
  post_id,
  post_title,
  post_summary,
  post_thumbnail,
  author_name,
  post_createdAt,
  post_updatedAt
}: PostCardProps) {

  const router = useRouter();

  //Handles date logic to know if the card shows 'Updated on' or 'Created on' in the date portion
  const dateCheck = (
    post_createdAt.getDate() == post_updatedAt.getDate() &&
    post_createdAt.getMonth() == post_updatedAt.getMonth() &&
    post_createdAt.getUTCFullYear() == post_updatedAt.getUTCFullYear()
  );
  
  //Handles viewing of a specific post by clicking on their card
  const handleViewPost = () => {
    router.push(`/posts/${post_id}`)
  }

  //Main post card component
  return (
    <Card className="relative overflow-hidden border border-slate-200 bg-white p-0 shadow-sm transition-shadow hover:shadow-md text-scarlet" onClick={handleViewPost}>
      <div className={`flex items-center ps-2 justify-center h-32 mt-5 ml-3 mr-5`}>
        <img
          src={post_thumbnail.valueOf()}
          alt={"Image not loaded"}
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="px-4 pb-4">
        <CardTitle className="text-base font-bold text-slate-900">
          <div className="flex justify-start items-baseline gap-4">
            <p className="text-black text-3xl">{post_title + " "}</p>
            <p className="text-black">{"By " + author_name}</p>
          </div>
        </CardTitle>

        <div className="h-px bg-black mb-1" />

        <div className="text-slate-900">
          <p>{post_summary}</p>
          {(dateCheck) ? (
            <p className="italic">{"Created on " + post_updatedAt.toLocaleDateString()}</p>
          ) : (
            <p className="italic">{"Last updated on " + post_updatedAt.toLocaleDateString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
