import mongoose from "mongoose"; // Import the Mongoose library to interact with MongoDB
import { config } from "./config.js"; // Import configuration settings, such as the database URL
import {User} from "./../modals/USer.modal.js"
// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Listen for the 'connected' event on the Mongoose connection
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB 🚀 " + mongoose.connection.host); // Log a success message when connected
    });

    // Listen for the 'error' event on the Mongoose connection
    mongoose.connection.on("error", (err) => {
      console.log("Error connecting to MongoDB", err); // Log an error message if there's an issue connecting
    });

    // Attempt to connect to the MongoDB database using the connection URL from the config
    await mongoose.connect(config.databaseUrl);
    await User.syncIndexes();
  } catch (error) {
    // If an error occurs during the connection attempt, log the error and exit the process
    console.error(`Error: Failed to connect to the database`, error);
    process.exit(1); // Exit the application with a failure code
  }
};

export default connectDB; // Export the connectDB function as the default export