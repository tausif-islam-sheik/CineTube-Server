/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import { CreateMovieInput, UpdateMovieInput, GetMoviesQuery } from './movies.validation';
import { IMoviesService } from './movies.interface';

/**
 * Generate URL-friendly slug from string
 */
const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export class MoviesService implements IMoviesService {
  /**
   * Create a new movie
   */
  async createMovie(data: CreateMovieInput) {
    try {
      // Generate slug from title
      const movieSlug = generateSlug(data.title);

      // Check if slug already exists
      const existingMovie = await prisma.movie.findUnique({
        where: { slug: movieSlug },
      });

      if (existingMovie) {
        throw new AppError(400, 'A movie with this title already exists');
      }

      const movie = await prisma.movie.create({
        data: {
          title: data.title,
          description: data.description,
          genre: data.genre,
          releaseYear: data.releaseYear,
          director: data.director,
          cast: data.cast || [],
          posterUrl: data.posterUrl,
          trailerUrl: data.trailerUrl,
          duration: data.duration,
          language: data.language || ['English'],
          pricing: (data.pricing || 'PREMIUM') as any,
          price: data.price,
          youtubeLink: data.youtubeLink,
          slug: movieSlug,
          platform: data.platform,
        } as any,
      });

      return movie;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        500,
        'Failed to create movie',
      );
    }
  }

  /**
   * Get movies with filters, pagination, and sorting
   */
  async getMovies(filters: GetMoviesQuery): Promise<any> {
    try {
      const {
        limit = 10,
        page = 1,
        genre,
        releaseYear,
        pricing,
        minRating,
        maxRating,
        sortBy = 'createdAt',
        order = 'desc',
        search,
        language,
      } = filters;

      const skip = (page - 1) * limit;

      // Build where clause dynamically
      const whereClause: Prisma.MovieWhereInput = {
        isDeleted: false,
      };

      // Search by title or description
      if (search) {
        whereClause.OR = [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            director: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      // Filter by genre (array contains)
      if (genre) {
        whereClause.genre = {
          has: genre,
        };
      }

      // Filter by release year
      if (releaseYear) {
        whereClause.releaseYear = releaseYear;
      }

      // Filter by pricing
      if (pricing) {
        whereClause.pricing = pricing as any;
      }

      // Filter by language (array contains)
      if (language) {
        whereClause.language = {
          has: language,
        };
      }

      // Filter by rating
      if (minRating !== undefined && maxRating !== undefined) {
        whereClause.averageRating = {
          gte: minRating,
          lte: maxRating,
        };
      } else if (minRating !== undefined) {
        whereClause.averageRating = {
          gte: minRating,
        };
      } else if (maxRating !== undefined) {
        whereClause.averageRating = {
          lte: maxRating,
        };
      }

      // Build orderBy
      const orderBy: Prisma.MovieOrderByWithRelationInput = {};
      if (sortBy === 'rating') {
        orderBy.averageRating = order as Prisma.SortOrder;
      } else if (sortBy === 'releaseYear') {
        orderBy.releaseYear = order as Prisma.SortOrder;
      } else if (sortBy === 'title') {
        orderBy.title = order as Prisma.SortOrder;
      } else {
        orderBy.createdAt = order as Prisma.SortOrder;
      }

      // Fetch total count and movies
      const [total, movies] = await Promise.all([
        prisma.movie.count({ where: whereClause }),
        prisma.movie.findMany({
          where: whereClause,
          orderBy,
          skip,
          take: limit,
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        data: movies,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      throw new AppError(500, 'Failed to fetch movies');
    }
  }

  /**
   * Get a single movie by slug
   */
  async getMovieBySlug(movieSlug: string): Promise<any | null> {
    try {
      const movie = await prisma.movie.findUnique({
        where: { slug: movieSlug },
      });

      if (!movie || movie.isDeleted) {
        return null;
      }

      return movie;
    } catch (error) {
      throw new AppError(500, 'Failed to fetch movie');
    }
  }

  /**
   * Get a single movie by ID
   */
  async getMovieById(id: string): Promise<any | null> {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id },
      });

      if (!movie || movie.isDeleted) {
        return null;
      }

      return movie;
    } catch (error) {
      throw new AppError(500, 'Failed to fetch movie');
    }
  }

  /**
   * Update a movie
   */
  async updateMovie(id: string, data: UpdateMovieInput) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id },
      });

      if (!movie) {
        throw new AppError(404, 'Movie not found');
      }

      if (movie.isDeleted) {
        throw new AppError(404, 'Movie not found');
      }

      // If title is being updated, regenerate slug
      let newSlug = movie.slug;
      if (data.title) {
        newSlug = generateSlug(data.title);

        // Check if new slug conflicts with existing movie
        const existingMovie = await prisma.movie.findUnique({
          where: { slug: newSlug },
        });

        if (existingMovie && existingMovie.id !== id) {
          throw new AppError(400, 'A movie with this title already exists');
        }
      }

      const updatedMovie = await prisma.movie.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          genre: data.genre,
          releaseYear: data.releaseYear,
          director: data.director,
          cast: data.cast,
          posterUrl: data.posterUrl === '' ? null : data.posterUrl,
          trailerUrl: data.trailerUrl === '' ? null : data.trailerUrl,
          duration: data.duration,
          language: data.language,
          pricing: data.pricing as any,
          price: data.price,
          youtubeLink: data.youtubeLink === '' ? null : data.youtubeLink,
          slug: newSlug,
          platform: data.platform,
          updatedAt: new Date(),
        } as any,
      });

      return updatedMovie;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to update movie');
    }
  }

  /**
   * Soft delete a movie
   */
  async deleteMovie(id: string) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id },
      });

      if (!movie) {
        throw new AppError(404, 'Movie not found');
      }

      if (movie.isDeleted) {
        throw new AppError(404, 'Movie not found');
      }

      const deletedMovie = await prisma.movie.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return deletedMovie;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Failed to delete movie');
    }
  }
}

export const moviesService = new MoviesService();
