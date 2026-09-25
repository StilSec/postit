import { db } from "@/lib/prisma";
import EditPostDetailsPage from "@/app/(dashboard)/posts/editPost/[post_id]/editPostDetails";


interface PostDetailPageProps {
  params: { post_id: String };
}

//Takes the post_id parameter from the url (i.e. posts/1 = 1)
//and passes it to the actual post details' page
export default async function EditPostPage({
  params,
}: PostDetailPageProps) {
  const parameters = await params;
  const postId = Number(parameters.post_id);

  const post = Number.isNaN(postId)
    ? null
    : await db.post.findUnique({
      where: { post_id: postId },
  });

  //Captures and passes the necessary details to initialize the post page

  return (
    <EditPostDetailsPage 
      postId={post!.post_id}
      oldTitle={post!.post_title}
      oldContent={post!.post_content}
      oldSummary={post!.post_summary}
      oldThumbnail={post!.post_thumbnail}
    />
  );
}
