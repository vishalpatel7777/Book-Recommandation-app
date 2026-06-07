const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const ctrl = require("../controllers/readingStatus.controller");

router.use(authenticateToken);

router.post("/reading-status",            ctrl.setStatus);
router.delete("/reading-status/:bookId",  ctrl.removeStatus);
router.get("/reading-status/:bookId",     ctrl.getBookStatus);
router.get("/reading-statuses",           ctrl.getAllStatuses);
router.get("/reading-status-counts",      ctrl.getStatusCounts);

module.exports = router;
