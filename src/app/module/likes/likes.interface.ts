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
  toggleLike(userId: string, reviewId: string): Promise<{ liked: boolean; like?: any }>;
  getLikes(filters: any): Promise<PaginatedResult<any>>;
  getReviewLikes(reviewId: string, limit?: number, page?: number): Promise<PaginatedResult<any>>;
  getUserLikes(userId: string, limit?: number, page?: number): Promise<PaginatedResult<any>>;
  getReviewLikesCount(reviewId: string): Promise<number>;
}
