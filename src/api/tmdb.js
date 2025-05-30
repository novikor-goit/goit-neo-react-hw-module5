import axios from 'axios';

class BaseDto {
  /**
   * Convert an array of objects to an array of DTO instances
   * @param {Array<Object>} dataArray - Array of raw data objects
   * @param {Function} DtoClass - DTO class constructor
   * @param {...any} constructorArgs - Additional arguments to pass to the DTO constructor (after the item itself)
   * @returns {Array} Array of DTO instances
   * @throws {Error} If validation fails
   */
  static fromArray(dataArray, DtoClass, ...constructorArgs) {
    if (!dataArray) {
      throw new Error('Data array is required');
    }
    if (!Array.isArray(dataArray)) {
      throw new Error('Data array must be an array');
    }
    return dataArray.map((item) => new DtoClass(item, ...constructorArgs));
  }
}

class MovieBasicDto extends BaseDto {
  /** @type {number} */
  id;
  /** @type {string} */
  title;
  /** @type {string} */
  poster;
  /** @type {number} */
  vote_average;

  /**
   * @param {Object} data - Raw movie data
   * @param {number} data.id - Movie ID
   * @param {string} data.title - Movie title
   * @param {string} [data.poster_path] - Poster path
   * @param {number} [data.vote_average] - e.g., 7.5
   * @param {string} imageBaseUrl - Base URL for images
   * @param {string} defaultImage - Default image URL
   * @throws {Error} If data is missing
   */
  constructor(data, imageBaseUrl, defaultImage) {
    super();
    if (!data) throw new Error('Movie data is required');
    this.id = data.id;
    this.title = data.title;
    this.vote_average = data.vote_average;
    this.poster = data.poster_path && imageBaseUrl ? imageBaseUrl + data.poster_path : defaultImage;
  }
}

class MovieDetailedDto extends MovieBasicDto {
  /** @type {number} */
  vote;
  /** @type {string} */
  release_year;
  /** @type {string} */
  overview;
  /** @type {string[]} */
  genres;

  /**
   * @param {Object} data - Raw movie data (includes properties for MovieBasicDto as well)
   * @param {number} data.vote_average - Vote average (0-10)
   * @param {string} data.release_date - Release date (YYYY-MM-DD)
   * @param {string} data.overview - Movie overview
   * @param {Array<{id: number, name: string}>} data.genres - Genres
   * @param {string} imageBaseUrl - Base URL for images
   * @param {string} defaultImage - Default image URL
   * @throws {Error} If data is missing
   */
  constructor(data, imageBaseUrl, defaultImage) {
    super(data, imageBaseUrl, defaultImage); // Call MovieBasicDto constructor for id, title, poster
    if (!data) throw new Error('Movie data is required for detailed view'); // data is already checked in super, but good for clarity

    this.vote = data.vote_average ? Math.round(Number(data.vote_average) * 10) : 0;
    this.release_year = data.release_date ? data.release_date.slice(0, 4) : '';
    this.overview = data.overview || '';
    this.genres = Array.isArray(data.genres)
      ? data.genres.map((genre) => genre?.name || '').filter(Boolean)
      : [];
  }
}

class CastMemberDto extends BaseDto {
  /** @type {number} */
  id;
  /** @type {string} */
  name;
  /** @type {string} */
  character;
  /** @type {string} */
  profile_path;

  /**
   * @param {Object} data - Raw cast data
   * @param {string} imageBaseUrl - Base URL for images
   * @param {string} defaultImage - Default image URL
   * @throws {Error} If data is missing
   */
  constructor(data, imageBaseUrl, defaultImage) {
    super();
    if (!data) throw new Error('Cast data is required');

    this.id = data.id;
    this.name = data.name || '';
    this.character = data.character || '';
    this.profile_path =
      data.profile_path && imageBaseUrl ? imageBaseUrl + data.profile_path : defaultImage;
  }
}

class ReviewDto extends BaseDto {
  /** @type {string} */
  id;
  /** @type {string} */
  author;
  /** @type {string} */
  content;

  /**
   * @param {Object} data - Raw review data
   * @throws {Error} If data is missing
   */
  constructor(data) {
    super();
    if (!data) throw new Error('Review data is required');

    this.id = data.id || '';
    this.author = data.author || '';
    this.content = data.content ? data.content.replace(/<[^>]*>/g, '') : '';
  }
}

class TmdbApi {
  #API_BASE_URL = 'https://api.themoviedb.org/3/';
  #IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500/';
  #DEFAULT_IMAGE = 'https://placehold.co/500x750?text=No+Picture';

  constructor() {
    axios.defaults.baseURL = this.#API_BASE_URL;
    axios.defaults.headers.common['Authorization'] =
      `Bearer ${import.meta.env.VITE_TMDB_ACCESS_KEY}`;
  }

  /**
   * @returns {Promise<MovieBasicDto[]>}
   * @throws {Error} If API request fails
   */
  async getTrendingMovies() {
    try {
      const { data } = await axios.get('trending/movie/day');
      // Pass imageBaseUrl and defaultImage to fromArray for MovieBasicDto constructor
      return BaseDto.fromArray(
        data?.results,
        MovieBasicDto,
        this.#IMAGE_BASE_URL,
        this.#DEFAULT_IMAGE
      );
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  }

  /**
   * @param {string} query - Search term
   * @returns {Promise<MovieBasicDto[]>}
   * @throws {Error} If query is missing or API request fails
   */
  async searchMovies(query) {
    if (!query) throw new Error('Search query is required');

    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const { data } = await axios.get(`search/movie?query=${encodedQuery}`);
      // Pass imageBaseUrl and defaultImage to fromArray for MovieBasicDto constructor
      return BaseDto.fromArray(
        data?.results,
        MovieBasicDto,
        this.#IMAGE_BASE_URL,
        this.#DEFAULT_IMAGE
      );
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  /**
   * @param {number|string} id - Movie ID
   * @returns {Promise<MovieDetailedDto>}
   * @throws {Error} If ID is missing or API request fails
   */
  async getMovieById(id) {
    if (!id) throw new Error('Movie ID is required');

    try {
      const { data } = await axios.get(`movie/${id}`);
      return new MovieDetailedDto(data, this.#IMAGE_BASE_URL, this.#DEFAULT_IMAGE);
    } catch (error) {
      console.error(`Error fetching movie with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * @param {number|string} id - Movie ID
   * @returns {Promise<CastMemberDto[]>}
   * @throws {Error} If ID is missing or API request fails
   */
  async getMovieCast(id) {
    if (!id) throw new Error('Movie ID is required');

    try {
      const { data } = await axios.get(`movie/${id}/credits`);
      // Pass imageBaseUrl and defaultImage to fromArray for CastMemberDto constructor
      return BaseDto.fromArray(
        data?.cast,
        CastMemberDto,
        this.#IMAGE_BASE_URL,
        this.#DEFAULT_IMAGE
      );
    } catch (error) {
      console.error(`Error fetching cast for movie with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * @param {number|string} id - Movie ID
   * @returns {Promise<ReviewDto[]>}
   * @throws {Error} If ID is missing or API request fails
   */
  async getMovieReviews(id) {
    if (!id) throw new Error('Movie ID is required');

    try {
      const { data } = await axios.get(`movie/${id}/reviews`);
      return BaseDto.fromArray(data?.results, ReviewDto);
    } catch (error) {
      console.error(`Error fetching reviews for movie with id ${id}:`, error);
      throw error;
    }
  }
}

const api = new TmdbApi();
export default api;
