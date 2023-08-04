const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const User = require("./models/User");
const Feedback = require("./models/Feedback");
const OTP = require("./models/OTP");
const ResetCode = require("./models/Reset");
const Classified = require("./models/classified");

const url = process.env.mongo_url;

app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/", require("./routes/authRoutes"));

//
//Database and server created
const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", false);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Error occurred");
  });
