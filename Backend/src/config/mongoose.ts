import mongoose from "mongoose";

process.loadEnvFile();

function mongooseConnection() {
  mongoose.set("strictQuery", true);

  let url: string = String(process.env.MONGO);
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:\n", error);
    });
}

export { mongooseConnection };
