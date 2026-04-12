/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { moviesService } from './movies.service';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';
import {
  createMovieSchema,
  updateMovieSchema,
  getMoviesQuerySchema,
  deleteMovieSchema,
  updateMovieParamsSchema,
} from './movies.validation';
import AppError from '../../errorHelpers/AppError';

export class MoviesController {
  /**
   * Create a new movie (Admin only)
   */
  static createMovie = catchAsync(async (req: any, res: Response) => {
    // Validate request body
    const validatedData = createMovieSchema.parse({ body: req.body });

    const movie = await moviesService.createMovie(validatedData.body);

    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  });

  /**
   * Get all movies with filters and pagination
   */
  static getMovies = catchAsync(async (req: Request, res: Response) => {
    // Validate query parameters
    const validatedQuery = getMoviesQuerySchema.parse({ query: req.query || {} });

    const result = await moviesService.getMovies(validatedQuery.query);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Movies retrieved successfully',
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    });
  });

  /**
   * Get a single movie by slug or ID
   */
  static getMovieBySlug = catchAsync(async (req: Request, res: Response) => {
    const slugOrId = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

    let movie = null;
    
    // Check if the parameter is a valid UUID to try ID lookup first
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slugOrId)) {
      movie = await moviesService.getMovieById(slugOrId);
    }

    // Fallback to slug lookup if not found by ID or not a UUID
    if (!movie) {
      movie = await moviesService.getMovieBySlug(slugOrId);
    }

    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Movie retrieved successfully',
      data: movie,
    });
  });

  /**
   * Update a movie (Admin only)
   */
  static updateMovie = catchAsync(async (req: any, res: Response) => {
    // Validate params
    const validatedParams = updateMovieParamsSchema.parse({ params: req.params });
    // Validate body
    const validatedData = updateMovieSchema.parse({ body: req.body });

    const movie = await moviesService.updateMovie(
      validatedParams.params.id,
      validatedData.body,
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Movie updated successfully',
      data: movie,
    });
  });

  /**
   * Delete a movie (Admin only)
   */
  static deleteMovie = catchAsync(async (req: any, res: Response) => {
    // Validate params
    const validatedParams = deleteMovieSchema.parse({ params: req.params });

    await moviesService.deleteMovie(validatedParams.params.id);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Movie deleted successfully',
      data: null,
    });
  });
}
