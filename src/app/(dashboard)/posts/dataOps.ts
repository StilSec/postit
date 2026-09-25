'use server'

//File for all data operations related to project
import { db } from "@/lib/prisma";
import { getSession, createSession, deleteSession } from "@/lib/session"

//structure of post data object
export interface Post {
  post_id: number,
  post_title: String,
  post_content: String,
  post_summary: String,
  post_thumbnail: String,
  author_id: number,
  author_name: String,
  post_createdAt: Date,
  post_updatedAt: Date
}

//structure of user data object
export interface User {
  user_id: number,
  user_username: String,
  user_picture: String,
  user_createdAt: Date
}

//structure of comment data object
export interface Comment {
  comment_id: number,
  post_id: number,
  comment_content: String,
  author_name: String,
  author_picture: String,
  comment_createdAt: Date
}

//gets all posts in the database
export default async function getPosts() {
  const posts = await db.post.findMany({
    take: 10,
    orderBy: {post_updatedAt: 'desc'}
  });

  return posts;
}

//checks if the username entered during login is in the database
export async function isValidUser(user_username: string) {
  const user = await db.user.findFirst({
    where: {user_username: user_username}
  })

  return user;
}

//passes the necessary parameters to the session object after login
export async function initializeSession(user_username: string) {
  const user = await db.user.findFirst({
    where: {user_username: user_username}
  })

  await createSession({
    user_id: user!.user_id,
    user_username: user!.user_username,
    user_picture: user!.user_picture,
  });
}

//deletes the current session after logout
export async function deleteUserSession() {
  await deleteSession();
}

//creates the post and inserts it into the database
export async function createPost(
  post_title: string,
  post_content: string,
  post_summary: string,
  post_thumbnail: string
) {
  const session = await getSession();
  const user_id = session!.user_id;

  const user = await db.user.findFirst({
    where: {user_id: user_id}
  });

  await db.post.create({
    data: {
      post_title: post_title,
      post_content: post_content,
      post_summary: post_summary,
      post_thumbnail: post_thumbnail,
      author_id: user!.user_id,
      author_name: user!.user_username,
      post_createdAt: new Date(),
      post_updatedAt: new Date()
    }
  })
}

//deletes the post from the database, as well as its related comments
export async function deletePost(post_id: number) {
  await db.comment.deleteMany({
    where: {post_id: post_id}
  })

  await db.post.delete({
    where: {post_id: post_id}
  })
}

//adds a comment and puts it in the database
export async function addComment(post_id: number, comment_content: string) {
  const session = await getSession();

  await db.comment.create({
    data: {
      post_id: post_id,
      comment_content: comment_content,
      author_name: session!.user_username.valueOf(),
      author_picture: session!.user_picture.valueOf(),
      comment_createdAt: new Date()
    }
  })
}

//gets a post via its post id
export async function getPost(post_id: number) {
  const post = await db.post.findFirst({
    where: {post_id: post_id}
  });

  return post;
}

//gets all of the comments of a post
export async function getComments(post_id: number) {
  const comments = await db.comment.findMany({
    where: {post_id: post_id}
  });

  return comments;
}

//deletes a comment
export async function deleteComment(comment_id: number) {
  await db.comment.delete({
    where: {comment_id: comment_id}
  })
}

//edits a post's details
export async function editPost(
  post_id: number,
  post_title: string,
  post_content: string,
  post_summary: string,
  post_thumbnail: string
) {
  await db.post.update({
    where: {post_id: post_id},
    data: {
      post_title: post_title,
      post_content: post_content,
      post_summary: post_summary,
      post_thumbnail: post_thumbnail,
      post_updatedAt: new Date()
    }
  })
}

//gets the posts of the user currently logged in
export async function getUserPosts() {
  const session = await getSession();

  const posts = await db.post.findMany({
    where: {author_id: session!.user_id},
    orderBy: {post_updatedAt: 'desc'}
  })

  return posts;
}