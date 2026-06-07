const ReadingStatus = require("../models/readingStatus.model");

const upsertStatus = async (userId, bookId, status) => {
  const now = new Date();
  const update = { status };
  if (status === "reading")   update.startedAt   = now;
  if (status === "completed") update.completedAt = now;

  return ReadingStatus.findOneAndUpdate(
    { userId, bookId },
    { $set: update },
    { upsert: true, new: true, runValidators: true }
  );
};

const removeStatus = async (userId, bookId) => {
  return ReadingStatus.findOneAndDelete({ userId, bookId });
};

const getStatusForBook = async (userId, bookId) => {
  return ReadingStatus.findOne({ userId, bookId });
};

const getAllStatuses = async (userId) => {
  return ReadingStatus.find({ userId }).populate("bookId", "title author image price genre ratings");
};

const getStatusCounts = async (userId) => {
  const statuses = ["want_to_read", "reading", "completed", "dropped"];
  const results = await ReadingStatus.aggregate([
    { $match: { userId: require("mongoose").Types.ObjectId.createFromHexString(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const counts = Object.fromEntries(statuses.map((s) => [s, 0]));
  results.forEach(({ _id, count }) => { counts[_id] = count; });
  return counts;
};

module.exports = { upsertStatus, removeStatus, getStatusForBook, getAllStatuses, getStatusCounts };
