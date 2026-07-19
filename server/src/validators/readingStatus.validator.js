const { z } = require("zod");

const VALID_STATUSES = ["want_to_read", "reading", "completed", "dropped"];

const setStatusSchema = z.object({
  bookId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid bookId"),
  status: z.enum(VALID_STATUSES, { errorMap: () => ({ message: `status must be one of: ${VALID_STATUSES.join(", ")}` }) }),
});

const bookIdParamSchema = z.object({
  bookId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid bookId"),
});

module.exports = { setStatusSchema, bookIdParamSchema };
