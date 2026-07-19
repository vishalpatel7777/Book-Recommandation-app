const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const bookidHeaderSchema = z.object({
  bookid: objectIdSchema,
});

const bookidParamSchema = z.object({
  bookid: objectIdSchema,
});

module.exports = { bookidHeaderSchema, bookidParamSchema };
