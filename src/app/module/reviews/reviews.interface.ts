export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface IReviewsService {
  createReview(userId: string, data: any): Promise<any>;
  getReviews(filters: any): Promise<PaginatedResult<any>>;
  getReviewById(id: string): Promise<any | null>;
  updateReview(id: string, userId: string, data: any): Promise<any>;
  deleteReview(id: string, userId: string): Promise<any>;
  getMovieReviews(movieId: string, limit?: number, page?: number): Promise<PaginatedResult<any>>;
}
