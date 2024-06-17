

export interface Post {
  _id: string;
  userId: string;
  images: string[];
  description: string;
  likes: string[]; // Assuming the likes are stored as user IDs
  saved: string[];
  comments:string[]; // Assuming the saved posts are stored as post IDs
  hidden: boolean;
  blocked: boolean;
  adminBlock: boolean;
  deleted: boolean;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
  user:string;
  proImg:string;
  likesLength:number;
  userLiked:boolean;
}