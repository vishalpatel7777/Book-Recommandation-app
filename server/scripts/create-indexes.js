"use strict";

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { MongoClient } = require("mongodb");

const DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URI;
if (!DATABASE_URL) {
  console.error(JSON.stringify({ level: "error", msg: "DATABASE_URL/DB_URI is not set — set DB_URI in server/.env (see .env.example)" }));
  process.exit(1);
}

const DB_NAME = new URL(DATABASE_URL.replace("mongodb+srv://", "https://")).pathname.slice(1).split("?")[0]
  || "bookmosaic";

function log(level, collection, indexName, msg, extra) {
  const entry = { level, ts: new Date().toISOString(), collection, index: indexName, msg };
  if (extra) Object.assign(entry, extra);
  console.log(JSON.stringify(entry));
}

async function ensureIndex(db, collection, keySpec, options) {
  const name = options.name;
  try {
    await db.collection(collection).createIndex(keySpec, options);
    log("info", collection, name, "created or already exists");
    return { status: "ok", name };
  } catch (err) {
    log("error", collection, name, "failed", { error: err.message, code: err.code });
    return { status: "error", name, error: err.message };
  }
}

async function ensureTextIndex(db) {
  const name = "books_text_search";
  const collection = "books";
  const keySpec = { title: "text", author: "text", genre: "text" };

  const existing = await db.collection(collection).indexes();
  const existingText = existing.find((idx) => idx.textIndexVersion !== undefined);

  if (existingText) {
    const sameIndex =
      existingText.name === name &&
      existingText.weights &&
      "title" in existingText.weights &&
      "author" in existingText.weights &&
      "genre" in existingText.weights;

    if (sameIndex) {
      log("info", collection, name, "created or already exists");
      return { status: "ok", name };
    }

    log("warn", collection, existingText.name, "dropping stale text index to recreate with correct fields", {
      existingName: existingText.name,
    });
    try {
      await db.collection(collection).dropIndex(existingText.name);
      log("info", collection, existingText.name, "dropped");
    } catch (err) {
      log("error", collection, existingText.name, "failed to drop stale text index", { error: err.message });
      return { status: "error", name, error: `could not drop stale text index: ${err.message}` };
    }
  }

  return ensureIndex(db, collection, keySpec, { name });
}

async function run() {
  const client = new MongoClient(DATABASE_URL);
  let db;

  try {
    await client.connect();
    db = client.db(DB_NAME);
    log("info", null, null, "connected to MongoDB", { db: DB_NAME });
  } catch (err) {
    log("error", null, null, "failed to connect to MongoDB", { error: err.message });
    process.exit(1);
  }

  const results = [];

  // INDEX 1: orders — cashfreeOrderId sparse unique
  results.push(await ensureIndex(db, "orders", { cashfreeOrderId: 1 }, {
    unique: true, sparse: true, name: "orders_cashfreeOrderId_sparse_unique",
  }));

  // INDEX 2: coupons — code case-insensitive unique
  results.push(await ensureIndex(db, "coupons", { code: 1 }, {
    unique: true,
    collation: { locale: "en", strength: 2 },
    name: "coupons_code_ci_unique",
  }));

  // INDEX 3: books — full-text search (special handling: drop+recreate if fields differ)
  results.push(await ensureTextIndex(db));

  // INDEX 4: auditlogs — TTL 90 days
  results.push(await ensureIndex(db, "auditlogs", { createdAt: 1 }, {
    expireAfterSeconds: 7776000, name: "auditlogs_ttl_90d",
  }));

  // INDEX 5: adminnotifications — TTL 90 days
  results.push(await ensureIndex(db, "adminnotifications", { createdAt: 1 }, {
    expireAfterSeconds: 7776000, name: "adminnotifications_ttl_90d",
  }));

  // INDEX 6: searchqueries — TTL 30 days
  results.push(await ensureIndex(db, "searchqueries", { createdAt: 1 }, {
    expireAfterSeconds: 2592000, name: "searchqueries_ttl_30d",
  }));

  // INDEX 7: library — compound userId + entries.bookId
  results.push(await ensureIndex(db, "library", { userId: 1, "entries.bookId": 1 }, {
    name: "library_userId_entries_bookId",
  }));

  // INDEX 8: users — role
  results.push(await ensureIndex(db, "users", { role: 1 }, {
    name: "users_role",
  }));

  // INDEX 9: users — createdAt
  results.push(await ensureIndex(db, "users", { createdAt: 1 }, {
    name: "users_createdAt",
  }));

  // INDEX 10: users — lastLogin
  results.push(await ensureIndex(db, "users", { lastLogin: 1 }, {
    name: "users_lastLogin",
  }));

  // INDEX 11: books — status
  results.push(await ensureIndex(db, "books", { status: 1 }, {
    name: "books_status",
  }));

  // INDEX 12: books — genre
  results.push(await ensureIndex(db, "books", { genre: 1 }, {
    name: "books_genre",
  }));

  // INDEX 13: books — ratings descending
  results.push(await ensureIndex(db, "books", { ratings: -1 }, {
    name: "books_ratings_desc",
  }));

  // INDEX 14: books — createdAt descending
  results.push(await ensureIndex(db, "books", { createdAt: -1 }, {
    name: "books_createdAt_desc",
  }));

  // INDEX 15: orders — userId
  results.push(await ensureIndex(db, "orders", { userId: 1 }, {
    name: "orders_userId",
  }));

  // INDEX 16: orders — status
  results.push(await ensureIndex(db, "orders", { status: 1 }, {
    name: "orders_status",
  }));

  // INDEX 17: orders — createdAt descending
  results.push(await ensureIndex(db, "orders", { createdAt: -1 }, {
    name: "orders_createdAt_desc",
  }));

  // INDEX 18: payments — userId
  results.push(await ensureIndex(db, "payments", { userId: 1 }, {
    name: "payments_userId",
  }));

  // INDEX 19: payments — status
  results.push(await ensureIndex(db, "payments", { status: 1 }, {
    name: "payments_status",
  }));

  // INDEX 20: reviews — bookId
  results.push(await ensureIndex(db, "reviews", { bookId: 1 }, {
    name: "reviews_bookId",
  }));

  // INDEX 21: reviews — status
  results.push(await ensureIndex(db, "reviews", { status: 1 }, {
    name: "reviews_status",
  }));

  // INDEX 22: readingstatuses — userId
  results.push(await ensureIndex(db, "readingstatuses", { userId: 1 }, {
    name: "readingstatuses_userId",
  }));

  // INDEX 23: notifications — userId
  results.push(await ensureIndex(db, "notifications", { userId: 1 }, {
    name: "notifications_userId",
  }));

  // INDEX 24: notifications — createdAt descending
  results.push(await ensureIndex(db, "notifications", { createdAt: -1 }, {
    name: "notifications_createdAt_desc",
  }));

  // INDEX 25: notifications — read
  results.push(await ensureIndex(db, "notifications", { read: 1 }, {
    name: "notifications_read",
  }));

  // INDEX 26: coupons — status
  results.push(await ensureIndex(db, "coupons", { status: 1 }, {
    name: "coupons_status",
  }));

  // INDEX 27: coupons — expiresAt sparse
  results.push(await ensureIndex(db, "coupons", { expiresAt: 1 }, {
    sparse: true, name: "coupons_expiresAt_sparse",
  }));

  // INDEX 28: authors — name
  results.push(await ensureIndex(db, "authors", { name: 1 }, {
    name: "authors_name",
  }));

  // INDEX 29: authors — status
  results.push(await ensureIndex(db, "authors", { status: 1 }, {
    name: "authors_status",
  }));

  // INDEX 30: categories — status
  results.push(await ensureIndex(db, "categories", { status: 1 }, {
    name: "categories_status",
  }));

  // INDEX 31: promotions — status
  results.push(await ensureIndex(db, "promotions", { status: 1 }, {
    name: "promotions_status",
  }));

  // INDEX 32: promotions — scheduledAt
  results.push(await ensureIndex(db, "promotions", { scheduledAt: 1 }, {
    name: "promotions_scheduledAt",
  }));

  // INDEX 33: promotions — endsAt
  results.push(await ensureIndex(db, "promotions", { endsAt: 1 }, {
    name: "promotions_endsAt",
  }));

  // INDEX 34: auditlogs — actor
  results.push(await ensureIndex(db, "auditlogs", { actor: 1 }, {
    name: "auditlogs_actor",
  }));

  // INDEX 35: auditlogs — action
  results.push(await ensureIndex(db, "auditlogs", { action: 1 }, {
    name: "auditlogs_action",
  }));

  // INDEX 36: auditlogs — severity
  results.push(await ensureIndex(db, "auditlogs", { severity: 1 }, {
    name: "auditlogs_severity",
  }));

  // INDEX 37: adminnotifications — read
  results.push(await ensureIndex(db, "adminnotifications", { read: 1 }, {
    name: "adminnotifications_read",
  }));

  // INDEX 38: supporttickets — userId
  results.push(await ensureIndex(db, "supporttickets", { userId: 1 }, {
    name: "supporttickets_userId",
  }));

  // INDEX 39: supporttickets — status
  results.push(await ensureIndex(db, "supporttickets", { status: 1 }, {
    name: "supporttickets_status",
  }));

  // INDEX 40: supporttickets — createdAt descending
  results.push(await ensureIndex(db, "supporttickets", { createdAt: -1 }, {
    name: "supporttickets_createdAt_desc",
  }));

  // INDEX 41: searchqueries — query
  results.push(await ensureIndex(db, "searchqueries", { query: 1 }, {
    name: "searchqueries_query",
  }));

  // INDEX 42: searchqueries — userId sparse
  results.push(await ensureIndex(db, "searchqueries", { userId: 1 }, {
    sparse: true, name: "searchqueries_userId_sparse",
  }));

  // INDEX 43: mediaassets — type
  results.push(await ensureIndex(db, "mediaassets", { type: 1 }, {
    name: "mediaassets_type",
  }));

  // INDEX 44: mediaassets — bookId sparse
  results.push(await ensureIndex(db, "mediaassets", { bookId: 1 }, {
    sparse: true, name: "mediaassets_bookId_sparse",
  }));

  // INDEX 45: mediaassets — uploadedAt descending
  results.push(await ensureIndex(db, "mediaassets", { uploadedAt: -1 }, {
    name: "mediaassets_uploadedAt_desc",
  }));

  // INDEX 46: books — slug sparse unique (audit finding: nullable @unique removed from schema)
  results.push(await ensureIndex(db, "books", { slug: 1 }, {
    unique: true, sparse: true, name: "books_slug_sparse_unique",
  }));

  await client.close();

  const succeeded = results.filter((r) => r.status === "ok");
  const failed = results.filter((r) => r.status === "error");

  console.log(JSON.stringify({
    level: "info",
    ts: new Date().toISOString(),
    msg: "index creation complete",
    total: results.length,
    succeeded: succeeded.length,
    failed: failed.length,
    failedIndexes: failed.map((r) => ({ name: r.name, error: r.error })),
  }));

  if (failed.length > 0) {
    process.exit(1);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error(JSON.stringify({ level: "fatal", ts: new Date().toISOString(), msg: err.message }));
  process.exit(1);
});
