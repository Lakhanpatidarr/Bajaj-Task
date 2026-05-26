const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = require("./src/app");

dotenv.config();

const PORT = process.env.PORT || 3000;



// =============================
// CONNECT DATABASE
// =============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed");
    console.log(error.message);
  });
