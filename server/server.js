import connectDB from "./config/db.js";
import { app } from "./app.js";
import { config } from "./config/config.js";

const port = config.port || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚙️ Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });