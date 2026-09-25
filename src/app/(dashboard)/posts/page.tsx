import getPosts from "@/app/(dashboard)/posts/dataOps";
import Dashboard from "@/app/(dashboard)/posts/Dashboard";

export default async function PostsPage() {
  const posts = await getPosts();

  //Fetches all posts from the database and passes it as the initial parameters
  //for the actual dashboard
  return (
    <Dashboard initialPosts={posts} />
  );
}