export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface IMoviesService {
  createMovie(data: any): Promise<any>;
  getMovies(filters: any): Promise<PaginatedResult<any>>;
  getMovieBySlug(slug: string): Promise<any | null>;
  getMovieById(id: string): Promise<any | null>;
  updateMovie(id: string, data: any): Promise<any>;
  deleteMovie(id: string): Promise<any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
