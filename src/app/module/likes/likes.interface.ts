export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ILikesService {
  toggleLike(userId: string, movieId: string): Promise<{ liked: boolean; like?: any }>;
  getLikes(filters: any): Promise<PaginatedResult<any>>;
  getMovieLikes(movieId: string, limit?: number, page?: number): Promise<PaginatedResult<any>>;
  getUserLikes(userId: string, limit?: number, page?: number): Promise<PaginatedResult<any>>;
  getMovieLikesCount(movieId: string): Promise<number>;
}
