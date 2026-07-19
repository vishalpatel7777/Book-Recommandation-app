const { z } = require("zod");

const bookidHeaderSchema = z.object({
  bookid: z.string().regex(/^[a-f\d]{24}$/i, "Invalid bookid in header"),
});

module.exports = { bookidHeaderSchema };
