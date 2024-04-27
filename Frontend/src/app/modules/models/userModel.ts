export interface IUser {
  username: string;
  email: string;
  password?: string;
  fullname: string;
  profilePic?: string;
  phone?: string;
  bio?: string;
  chatList: string[]; // Assuming chatList contains user IDs or usernames
  savedPosts: string[]; // Assuming savedPosts contains post IDs or references
  online: boolean;
  blocked: boolean;
  verified: boolean;
}


