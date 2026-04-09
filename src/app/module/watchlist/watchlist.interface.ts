export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface IWatchlistService {
  addToWatchlist(userId: string, movieId: string): Promise<any>;
  removeFromWatchlist(id: string, userId: string): Promise<any>;
  getUserWatchlist(userId: string, limit?: number, page?: number, sortBy?: string, order?: string): Promise<PaginatedResult<any>>;
  checkIfInWatchlist(userId: string, movieId: string): Promise<boolean>;
  getWatchlistCount(userId: string): Promise<number>;
}
