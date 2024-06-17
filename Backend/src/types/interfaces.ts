export interface Comment {
    userId: string;
    content: string;
    userName?: string; 
    profilePic?: string; 
  }



  export interface UserProfileUpdate {
    fullname?: string;
    username?: string;
    gender?: string;
    bio?: string;
    profilePic?: string;
  }