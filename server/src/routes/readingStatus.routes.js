const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { validate, validateParams } = require("../middleware/validate.middleware");
const { setStatusSchema, bookIdParamSchema } = require("../validators/readingStatus.validator");
const ctrl = require("../controllers/readingStatus.controller");

router.use(authenticateToken);

router.post("/reading-status",           validate(setStatusSchema), ctrl.setStatus);
router.delete("/reading-status/:bookId", validateParams(bookIdParamSchema), ctrl.removeStatus);
router.get("/reading-status/:bookId",    validateParams(bookIdParamSchema), ctrl.getBookStatus);
router.get("/reading-statuses",          ctrl.getAllStatuses);
router.get("/reading-status-counts",     ctrl.getStatusCounts);

module.exports = router;
