export interface Comment {
    userId: string;
    content: string;
    userName?: string; // Optional, will be added later
    profilePic?: string; // Optional, will be added later
  }



  export interface UserProfileUpdate {
    fullname?: string;
    username?: string;
    gender?: string;
    bio?: string;
    profilePic?: string;
  }