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

const SPEC = [
  // Index 1
  {
    name: "orders_cashfreeOrderId_sparse_unique",
    collection: "orders",
    keySpec: { cashfreeOrderId: 1 },
    unique: true,
    sparse: true,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 2
  {
    name: "coupons_code_ci_unique",
    collection: "coupons",
    keySpec: { code: 1 },
    unique: true,
    sparse: false,
    ttl: null,
    collation: { locale: "en", strength: 2 },
    text: false,
  },
  // Index 3
  {
    name: "books_text_search",
    collection: "books",
    keySpec: { title: "text", author: "text", genre: "text" },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: true,
  },
  // Index 4
  {
    name: "auditlogs_ttl_90d",
    collection: "auditlogs",
    keySpec: { createdAt: 1 },
    unique: false,
    sparse: false,
    ttl: 7776000,
    collation: null,
    text: false,
  },
  // Index 5
  {
    name: "adminnotifications_ttl_90d",
    collection: "adminnotifications",
    keySpec: { createdAt: 1 },
    unique: false,
    sparse: false,
    ttl: 7776000,
    collation: null,
    text: false,
  },
  // Index 6
  {
    name: "searchqueries_ttl_30d",
    collection: "searchqueries",
    keySpec: { createdAt: 1 },
    unique: false,
    sparse: false,
    ttl: 2592000,
    collation: null,
    text: false,
  },
  // Index 7
  {
    name: "library_userId_entries_bookId",
    collection: "library",
    keySpec: { userId: 1, "entries.bookId": 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 8
  {
    name: "users_role",
    collection: "users",
    keySpec: { role: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 9
  {
    name: "users_createdAt",
    collection: "users",
    keySpec: { createdAt: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 10
  {
    name: "users_lastLogin",
    collection: "users",
    keySpec: { lastLogin: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 11
  {
    name: "books_status",
    collection: "books",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 12
  {
    name: "books_genre",
    collection: "books",
    keySpec: { genre: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 13
  {
    name: "books_ratings_desc",
    collection: "books",
    keySpec: { ratings: -1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 14
  {
    name: "books_createdAt_desc",
    collection: "books",
    keySpec: { createdAt: -1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 15
  {
    name: "orders_userId",
    collection: "orders",
    keySpec: { userId: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 16
  {
    name: "orders_status",
    collection: "orders",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 17
  {
    name: "orders_createdAt_desc",
    collection: "orders",
    keySpec: { createdAt: -1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 18
  {
    name: "payments_userId",
    collection: "payments",
    keySpec: { userId: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 19
  {
    name: "payments_status",
    collection: "payments",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 20
  {
    name: "reviews_bookId",
    collection: "reviews",
    keySpec: { bookId: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 21
  {
    name: "reviews_status",
    collection: "reviews",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 22
  {
    name: "readingstatuses_userId",
    collection: "readingstatuses",
    keySpec: { userId: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 23
  {
    name: "notifications_userId",
    collection: "notifications",
    keySpec: { userId: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 24
  {
    name: "notifications_createdAt_desc",
    collection: "notifications",
    keySpec: { createdAt: -1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 25
  {
    name: "notifications_read",
    collection: "notifications",
    keySpec: { read: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 26
  {
    name: "coupons_status",
    collection: "coupons",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 27
  {
    name: "coupons_expiresAt_sparse",
    collection: "coupons",
    keySpec: { expiresAt: 1 },
    unique: false,
    sparse: true,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 28
  {
    name: "authors_name",
    collection: "authors",
    keySpec: { name: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 29
  {
    name: "authors_status",
    collection: "authors",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 30
  {
    name: "categories_status",
    collection: "categories",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 31
  {
    name: "promotions_status",
    collection: "promotions",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 32
  {
    name: "promotions_scheduledAt",
    collection: "promotions",
    keySpec: { scheduledAt: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 33
  {
    name: "promotions_endsAt",
    collection: "promotions",
    keySpec: { endsAt: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 34
  {
    name: "auditlogs_actor",
    collection: "auditlogs",
    keySpec: { actor: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 35
  {
    name: "auditlogs_action",
    collection: "auditlogs",
    keySpec: { action: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 36
  {
    name: "auditlogs_severity",
    collection: "auditlogs",
    keySpec: { severity: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 37
  {
    name: "adminnotifications_read",
    collection: "adminnotifications",
    keySpec: { read: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 38
  {
    name: "supporttickets_userId",
    collection: "supporttickets",
    keySpec: { userId: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 39
  {
    name: "supporttickets_status",
    collection: "supporttickets",
    keySpec: { status: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 40
  {
    name: "supporttickets_createdAt_desc",
    collection: "supporttickets",
    keySpec: { createdAt: -1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 41
  {
    name: "searchqueries_query",
    collection: "searchqueries",
    keySpec: { query: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 42
  {
    name: "searchqueries_userId_sparse",
    collection: "searchqueries",
    keySpec: { userId: 1 },
    unique: false,
    sparse: true,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 43
  {
    name: "mediaassets_type",
    collection: "mediaassets",
    keySpec: { type: 1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 44
  {
    name: "mediaassets_bookId_sparse",
    collection: "mediaassets",
    keySpec: { bookId: 1 },
    unique: false,
    sparse: true,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 45
  {
    name: "mediaassets_uploadedAt_desc",
    collection: "mediaassets",
    keySpec: { uploadedAt: -1 },
    unique: false,
    sparse: false,
    ttl: null,
    collation: null,
    text: false,
  },
  // Index 46
  {
    name: "books_slug_sparse_unique",
    collection: "books",
    keySpec: { slug: 1 },
    unique: true,
    sparse: true,
    ttl: null,
    collation: null,
    text: false,
  },
];

const SPEC_NAMES = new Set(SPEC.map((s) => s.name));

function keySpecsMatch(actual, expected) {
  const aKeys = Object.keys(actual.key || {}).filter((k) => k !== "_fts" && k !== "_ftsx");
  const eKeys = Object.keys(expected.keySpec);

  if (expected.text) {
    const hasText = actual.textIndexVersion !== undefined;
    if (!hasText) return false;
    const weights = actual.weights || {};
    return eKeys.every((k) => k in weights);
  }

  if (aKeys.length !== eKeys.length) return false;
  return eKeys.every((k, i) => aKeys[i] === k && actual.key[k] === expected.keySpec[k]);
}

function collationMatches(actual, expected) {
  if (!expected.collation) return true;
  const ac = actual.collation;
  if (!ac) return false;
  return ac.locale === expected.collation.locale && ac.strength === expected.collation.strength;
}

async function run() {
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
  } catch (err) {
    console.error(JSON.stringify({ level: "error", msg: "failed to connect", error: err.message }));
    process.exit(1);
  }

  const db = client.db(DB_NAME);

  const collections = [...new Set(SPEC.map((s) => s.collection))];
  const allActual = {};

  for (const col of collections) {
    try {
      const indexes = await db.collection(col).indexes();
      allActual[col] = indexes;
    } catch {
      allActual[col] = [];
    }
  }

  const missing = [];
  const incorrect = [];
  const valid = [];

  for (const spec of SPEC) {
    const colIndexes = allActual[spec.collection] || [];
    const found = colIndexes.find((idx) => idx.name === spec.name);

    if (!found) {
      missing.push({ name: spec.name, collection: spec.collection, reason: "index not found" });
      continue;
    }

    const issues = [];

    if (!keySpecsMatch(found, spec)) {
      issues.push(`key spec mismatch: expected ${JSON.stringify(spec.keySpec)}, got ${JSON.stringify(found.key)}`);
    }

    if (spec.unique && !found.unique) {
      issues.push("missing unique: true");
    }
    if (!spec.unique && found.unique) {
      issues.push("unexpected unique: true");
    }

    if (spec.sparse && !found.sparse) {
      issues.push("missing sparse: true");
    }
    if (!spec.sparse && found.sparse) {
      issues.push("unexpected sparse: true");
    }

    if (spec.ttl !== null) {
      if (found.expireAfterSeconds === undefined) {
        issues.push(`missing expireAfterSeconds: ${spec.ttl}`);
      } else if (found.expireAfterSeconds !== spec.ttl) {
        issues.push(`TTL mismatch: expected ${spec.ttl}, got ${found.expireAfterSeconds}`);
      }
    }
    if (spec.ttl === null && found.expireAfterSeconds !== undefined) {
      issues.push(`unexpected expireAfterSeconds: ${found.expireAfterSeconds}`);
    }

    if (!collationMatches(found, spec)) {
      issues.push(`collation mismatch: expected ${JSON.stringify(spec.collation)}, got ${JSON.stringify(found.collation || null)}`);
    }

    if (issues.length > 0) {
      incorrect.push({ name: spec.name, collection: spec.collection, issues });
    } else {
      valid.push({ name: spec.name, collection: spec.collection });
    }
  }

  const extra = [];
  const SYSTEM_INDEX = "_id_";
  const PRISMA_MANAGED_SUFFIXES = ["_unique", "@@unique"];

  for (const col of collections) {
    const colIndexes = allActual[col] || [];
    for (const idx of colIndexes) {
      if (idx.name === SYSTEM_INDEX) continue;
      if (!SPEC_NAMES.has(idx.name)) {
        extra.push({ name: idx.name, collection: col });
      }
    }
  }

  const report = {
    ts: new Date().toISOString(),
    db: DB_NAME,
    summary: {
      expected: SPEC.length,
      valid: valid.length,
      missing: missing.length,
      incorrect: incorrect.length,
      extra: extra.length,
    },
    valid,
    missing,
    incorrect,
    extra,
  };

  console.log(JSON.stringify(report, null, 2));

  await client.close();

  if (missing.length > 0 || incorrect.length > 0) {
    process.exit(1);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error(JSON.stringify({ level: "fatal", ts: new Date().toISOString(), msg: err.message }));
  process.exit(1);
});
