export interface Comment {
  _id: string;
  userId: string;
  postId: string;
  content: string;
  parentId?: string;
  deleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}