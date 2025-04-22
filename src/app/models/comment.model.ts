export interface Comment {
    id: number;
    movieId: number;
    userId: string;
    content: string;
    createdAt: string;
  }
  
  export interface CreateComment {
    movieId: number;
    content: string;
  }