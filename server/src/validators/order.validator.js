const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const addPurchaseSchema = z.object({
  book:          objectIdSchema,
  paymentMethod: z.string().min(1, "paymentMethod is required").max(50),
});

module.exports = { addPurchaseSchema };
