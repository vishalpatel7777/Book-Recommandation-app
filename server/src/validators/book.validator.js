const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const addBookSchema = z.object({
  title:    z.string().min(1, "Title is required").max(200),
  author:   z.string().min(1, "Author is required").max(200),
  price:    z.coerce.number().min(0, "Price must be non-negative"),
  genre:    z.string().min(1, "Genre is required").max(100),
  desc:     z.string().min(1, "Description is required").max(5000),
  image:    z.string().url("Image must be a valid URL"),
  language: z.string().max(50).optional(),
});

const updateBookSchema = z.object({
  title:    z.string().min(1).max(200).optional(),
  author:   z.string().min(1).max(200).optional(),
  price:    z.coerce.number().min(0).optional(),
  genre:    z.string().min(1).max(100).optional(),
  desc:     z.string().min(1).max(5000).optional(),
  image:    z.string().url().optional(),
  language: z.string().max(50).optional(),
});

const storeRatingSchema = z.object({
  book: objectIdSchema,
  rate: z.coerce.number().int().min(1, "Rating must be between 1 and 5").max(5),
  user: objectIdSchema,
});

const storeReviewSchema = z.object({
  userId:  objectIdSchema,
  bookId:  objectIdSchema,
  rating:  z.coerce.number().int().min(1).max(5).optional(),
  review:  z.string().min(1, "Review text is required").max(2000),
});

const objectIdParamSchema = z.object({
  id: objectIdSchema,
});

const bookIdParamSchema = z.object({
  bookId: objectIdSchema,
});

const searchQuerySchema = z.object({
  search: z.string().max(100).optional(),
});

const paginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12).optional(),
});

const genreQuerySchema = z.object({
  genres: z.string().min(1, "genres parameter is required").max(500),
  limit:  z.coerce.number().int().min(1).max(50).optional(),
});

module.exports = {
  addBookSchema,
  updateBookSchema,
  storeRatingSchema,
  storeReviewSchema,
  objectIdParamSchema,
  bookIdParamSchema,
  searchQuerySchema,
  paginationSchema,
  genreQuerySchema,
};
