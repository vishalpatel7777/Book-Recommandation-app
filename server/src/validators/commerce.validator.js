const { z } = require("zod");

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const updatePaymentSettingsSchema = z.object({
    provider:             z.enum(["cashfree", "razorpay", "stripe", "mock"]).optional(),
    enabled:              z.boolean().optional(),
    testMode:             z.boolean().optional(),
    currency:             z.string().min(1).max(10).optional(),
    taxPercent:           z.number().min(0).max(100).optional(),
    refundEnabled:        z.boolean().optional(),
    emailReceiptsEnabled: z.boolean().optional(),
}).strip();

const updateOrderStatusSchema = z.object({
    status: z.enum(["Pending", "Completed", "Cancelled"]),
}).strip();

const processRefundSchema = z.object({
    action: z.enum(["approved", "rejected"]),
}).strip();

const setAccessModeSchema = z.object({
    accessMode: z.enum(["paid", "free", "preview", "hidden", "archived"]),
}).strip();

const objectIdParamSchema = z.object({
    orderId:  objectId.optional(),
    refundId: objectId.optional(),
    userId:   objectId.optional(),
    bookId:   objectId.optional(),
}).passthrough();

module.exports = {
    updatePaymentSettingsSchema,
    updateOrderStatusSchema,
    processRefundSchema,
    setAccessModeSchema,
    objectIdParamSchema,
};
