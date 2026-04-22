import mongoose from "mongoose";

const cleanupUserIndexes = async () => {
  try {
    const usersCollection = mongoose.connection.collection("users");
    const indexes = await usersCollection.indexes();
    const hasUsernameIndex = indexes.some((index) => index.name === "username_1");

    if (hasUsernameIndex) {
      await usersCollection.dropIndex("username_1");
      console.log("Dropped stale username_1 index from users collection");
    }
  } catch (error) {
    // Ignore missing collection/index cases and continue startup.
    if (error.codeName !== "NamespaceNotFound" && error.code !== 27) {
      console.warn("User index cleanup skipped:", error.message);
    }
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await cleanupUserIndexes();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
