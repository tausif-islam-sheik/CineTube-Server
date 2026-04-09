export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ICommentsService {
  createComment(userId: string, data: any): Promise<any>;
  getComments(filters: any): Promise<PaginatedResult<any>>;
  updateComment(id: string, userId: string, data: any): Promise<any>;
  deleteComment(id: string, userId: string): Promise<any>;
  getReviewComments(reviewId: string, limit?: number, page?: number): Promise<PaginatedResult<any>>;
}
