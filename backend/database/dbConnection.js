import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Faculty_project",
      useNewUrlParser: true, // Add useNewUrlParser option
      useUnifiedTopology: true // Add useUnifiedTopology option
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some Error occured. ${err}`);
    });
};
