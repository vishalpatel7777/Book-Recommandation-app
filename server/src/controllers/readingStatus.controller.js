const asyncHandler = require("../utils/asyncHandler");
const svc = require("../services/readingStatus.service");

const VALID = ["want_to_read", "reading", "completed", "dropped"];

exports.setStatus = asyncHandler(async (req, res) => {
  const { bookId, status } = req.body;
  if (!bookId || !VALID.includes(status)) {
    return res.status(400).json({ message: "bookId and valid status are required" });
  }
  const result = await svc.upsertStatus(req.user.id, bookId, status);
  res.status(200).json({ message: "Status updated", data: result });
});

exports.removeStatus = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  await svc.removeStatus(req.user.id, bookId);
  res.status(200).json({ message: "Status removed" });
});

exports.getBookStatus = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const result = await svc.getStatusForBook(req.user.id, bookId);
  res.status(200).json({ data: result });
});

exports.getAllStatuses = asyncHandler(async (req, res) => {
  const results = await svc.getAllStatuses(req.user.id);
  res.status(200).json({ data: results });
});

exports.getStatusCounts = asyncHandler(async (req, res) => {
  const counts = await svc.getStatusCounts(req.user.id);
  res.status(200).json({ data: counts });
});
