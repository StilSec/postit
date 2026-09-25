"use client";

import { useState } from "react";
import { PostCard } from "@/components/features/PostCard";
import getPosts, { Post, getUserPosts } from "@/app/(dashboard)/posts/dataOps";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

//Dashboard of the main page
export default function Dashboard({
  initialPosts,
}: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selfFilter, setSelfFilter] = useState(false);

  const router = useRouter();
  
  //Handles the function for the filter button (shows either own pages or pages of all users)
  async function filter() {
    const nextSelfFilter = !selfFilter;

    const filteredPosts = nextSelfFilter
      ? await getUserPosts()
      : await getPosts();

    setPosts(() => filteredPosts);
    setSelfFilter(nextSelfFilter);
  }

  //Main component
  return (
    <div className="flex flex-col min-h-[80vh] space-y-5">
      <div className="flex items-center justify-between gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-black">
            Posts
          </h2>
          <div className="flex items-center gap-3">
              <Button type="button" size="sm" className="w-32" onClick={filter}>
                {selfFilter ? "Show All Posts" : "Show Self Posts"}
              </Button>
            <Button type="button" size="sm" onClick={() => router.push(`/posts/addPost`)}>+ New Post</Button>
          </div>  
      </div>

      {(posts.length > 0) ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 items-start">
          {posts.map((post) => (
            <PostCard
              key={post.post_id}
              post_id={post.post_id}
              post_title={post.post_title}
              post_summary={post.post_summary}
              post_thumbnail={post.post_thumbnail}
              author_name={post.author_name}
              post_createdAt={post.post_createdAt}
              post_updatedAt={post.post_updatedAt}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold text-slate-900">No Posts</p>
          <p className="mt-3 text-sm text-slate-500">Create a post to start!</p>
        </div>
      )}
    </div>
  );
}
