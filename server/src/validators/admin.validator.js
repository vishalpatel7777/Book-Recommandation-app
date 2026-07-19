const { z } = require("zod");

const updateAdminProfileSchema = z.object({
  fullname:    z.string().min(2).max(100).optional(),
  email:       z.string().email().optional(),
  phone:       z.string().regex(/^\d{10}$/, "Phone must be 10 digits").optional(),
  age:         z.coerce.number().int().min(1).max(120).optional(),
  genre:       z.string().min(1).max(100).optional(),
  image:       z.string().url().optional(),
  password:    z.string().min(6).optional(),
  oldPassword: z.string().min(1).optional(),
}).refine(
  (data) => !(data.password && !data.oldPassword),
  { message: "oldPassword is required when changing password", path: ["oldPassword"] }
);

const objectIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
});

module.exports = { updateAdminProfileSchema, objectIdParamSchema };
