import { db } from "@/lib/prisma";
import ManagePost from "@/app/(dashboard)/posts/[post_id]/ManagePost";
import { getSession } from "@/lib/session"


interface PostDetailPageProps {
  params: { post_id: String };
}

//Takes the post_id parameter from the url (i.e. posts/1 = 1)
//and passes it to the actual post details' page
export default async function PostDetailPage({
  params,
}: PostDetailPageProps) {
    const parameters = await params;
    const postId = Number(parameters.post_id);

    const post = Number.isNaN(postId)
      ? null
      : await db.post.findUnique({
        where: { post_id: postId },
    });
    const user = await db.user.findFirst({
      where: {user_id: post?.author_id}
    })
    const comments = await db.comment.findMany({
      where: {post_id: post!.post_id}
    })

    //Checks if the current user is also the owner of the selected post
    const session = await getSession();
    const ownerCheck = (session!.user_id == user!.user_id);

    //Captures and passes the necessary details to initialize the post page

  return (
    <ManagePost initialPost={post!} user={user!} initialComments={comments!} ownerCheck={ownerCheck} />
  );
}
