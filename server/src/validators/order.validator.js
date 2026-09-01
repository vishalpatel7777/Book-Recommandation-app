const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const addPurchaseSchema = z.object({
  book:          z.union([objectIdSchema, z.array(objectIdSchema).min(1, "At least one book is required")]),
  paymentMethod: z.string().min(1, "paymentMethod is required").max(50),
  coupon:        z.string().max(50).optional().nullable(),
  discount:      z.coerce.number().min(0).optional(),
  total:         z.coerce.number().min(0).optional(),
});

module.exports = { addPurchaseSchema };
