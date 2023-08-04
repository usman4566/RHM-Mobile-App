const mongoose = require("mongoose");
const User = mongoose.model("User");

const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

feedbackSchema.pre("save", async function (next) {
  if (this.user) {
    const user = await User.findById(this.user);
    if (user) {
      this.name = user.name;
      this.email = user.email;
    }
  }
  next();
});

mongoose.model("Feedback", feedbackSchema);
