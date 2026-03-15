/**
 * fix-history-index.js
 * ---------------------
 * One-time script to drop the stale 'user_1_movie_1' index from the histories
 * collection and ensure the correct 'user_1_media_1' index exists.
 *
 * Run with: node fix-history-index.js
 */
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

async function fixHistoryIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("histories");

    // List all current indexes
    const indexes = await collection.indexes();
    console.log("\nCurrent indexes on 'histories':");
    indexes.forEach((idx) => console.log(" -", idx.name, JSON.stringify(idx.key)));

    // Drop the stale index if it exists
    const staleIndex = indexes.find((idx) => idx.name === "user_1_movie_1");
    if (staleIndex) {
      await collection.dropIndex("user_1_movie_1");
      console.log("\n✅ Dropped stale index: user_1_movie_1");
    } else {
      console.log("\nℹ️  Stale index 'user_1_movie_1' not found (already clean)");
    }

    // Ensure correct index exists
    await collection.createIndex({ user: 1, media: 1 }, { unique: true, name: "user_1_media_1" });
    console.log("✅ Ensured correct index: user_1_media_1");

    // List indexes again to confirm
    const newIndexes = await collection.indexes();
    console.log("\nFinal indexes on 'histories':");
    newIndexes.forEach((idx) => console.log(" -", idx.name, JSON.stringify(idx.key)));

    console.log("\n🎉 Done! History index is now fixed.");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixHistoryIndex();
