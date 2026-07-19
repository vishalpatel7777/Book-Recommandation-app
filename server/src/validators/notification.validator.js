const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const addNotificationSchema = z.object({
  book:        objectIdSchema,
  title:       z.string().min(1).max(300),
  image:       z.string().url().optional().or(z.literal("")),
  author:      z.string().max(200).optional(),
  price:       z.coerce.number().min(0).optional(),
  description: z.string().max(500).optional(),
});

const notificationIdParamSchema = z.object({
  id: objectIdSchema,
});

const notificationUserParamSchema = z.object({
  userId: objectIdSchema,
});

module.exports = { addNotificationSchema, notificationIdParamSchema, notificationUserParamSchema };
