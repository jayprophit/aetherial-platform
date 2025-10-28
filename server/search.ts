import lunr from "lunr";
import { getDb } from "./db";
import { posts, users } from "../drizzle/schema";

let postIndex: lunr.Index;
let userIndex: lunr.Index;

interface PostDocument {
  id: string;
  content: string;
  author: string;
}

interface UserDocument {
  id: string;
  username: string;
  displayName: string;
}

async function buildIndexes() {
  const db = await getDb();
  if (!db) return;

  // Build post index
  const allPosts = await db.select().from(posts);
  postIndex = lunr(function () {
    this.ref("id");
    this.field("content");
    this.field("author");

    allPosts.forEach(post => {
      this.add({
        id: post.id.toString(),
        content: post.content,
        author: post.userId.toString(), // In a real app, you'd join to get the author's name
      });
    });
  });

  // Build user index
  const allUsers = await db.select().from(users);
  userIndex = lunr(function () {
    this.ref("id");
    this.field("username");
    this.field("displayName");

    allUsers.forEach(user => {
      this.add({
        id: user.id.toString(),
        username: user.username,
        displayName: user.displayName || "",
      });
    });
  });

  console.log("Search indexes built.");
}

// Initial build
buildIndexes();

// Rebuild indexes periodically
setInterval(buildIndexes, 1000 * 60 * 60); // Every hour

export function searchPosts(query: string) {
  if (!postIndex) return [];
  return postIndex.search(query).map(result => parseInt(result.ref));
}

export function searchUsers(query: string) {
  if (!userIndex) return [];
  return userIndex.search(query).map(result => parseInt(result.ref));
}

// Functions to update the index when content changes
export function addPostToIndex(post: any) {
  if (!postIndex) return;
  postIndex.add({
    id: post.id.toString(),
    content: post.content,
    author: post.userId.toString(),
  });
}

export function updateUserInIndex(user: any) {
  if (!userIndex) return;
  userIndex.update({
    id: user.id.toString(),
    username: user.username,
    displayName: user.displayName || "",
  });
}

export function removePostFromIndex(postId: number) {
  if (!postIndex) return;
  postIndex.remove({ id: postId.toString() } as any);
}

export function removeUserFromIndex(userId: number) {
  if (!userIndex) return;
  userIndex.remove({ id: userId.toString() } as any);
}

