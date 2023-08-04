const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const jwtToken = require("../middleware/AuthTokenRequired");
const router = express.Router();
const User = mongoose.model("User");
const Feedback = mongoose.model("Feedback");
const OTP = mongoose.model("OTP");
const ResetCode = mongoose.model("ResetCode");
const Classified = mongoose.model("Classified");
const bcrypt = require("bcrypt");
require("dotenv").config();
const nodemailer = require("nodemailer");
const { cloudinary } = require("../middleware/cloudinary");
const { upload } = require("../middleware/multer");
const controllerError = require("../utils/controllerError");

async function generateOTP(email) {
  const OTP_LENGTH = 6;
  const otp = Math.floor(Math.random() * Math.pow(10, OTP_LENGTH))
    .toString()
    .padStart(OTP_LENGTH, "0");

  const otpDoc = new OTP({
    email,
    otp,
  });

  await otpDoc.save();

  return otp;
}

async function retrieveOTP(email) {
  const otpDoc = await OTP.findOne({ email });

  if (!otpDoc) {
    return null;
  }

  return otpDoc.otp;
}

async function verifyOTP(email, enteredOTP) {
  const storedOTP = await retrieveOTP(email);

  return storedOTP === enteredOTP;
}

const sendVerificationOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "usman.mustafa665@gmail.com",
        pass: "wvaaypinieayvzbk",
      },
    });

    const mailOptions = {
      from: "usman.mustafa665@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your verification OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Verification OTP sent successfully");
  } catch (error) {
    console.error("Error sending verification OTP:", error);
  }
};

async function generateResetCode(email) {
  const CODE_LENGTH = 6;
  const resetCode = Math.floor(Math.random() * Math.pow(10, CODE_LENGTH))
    .toString()
    .padStart(CODE_LENGTH, "0");

  const resetCodeDoc = new ResetCode({
    email,
    resetCode,
  });

  await resetCodeDoc.save();

  return resetCode;
}

async function verifyResetCode(email, resetCode) {
  const resetCodeDoc = await ResetCode.findOne({ email, resetCode });

  if (!resetCodeDoc) {
    return false;
  }

  const currentTime = new Date().getTime();
  return resetCodeDoc.expireIn >= currentTime;
}

const sendResetCode = async (email, resetCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "usman.mustafa665@gmail.com",
        pass: "wvaaypinieayvzbk",
      },
    });

    const mailOptions = {
      from: "usman.mustafa665@gmail.com",
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Password reset code sent successfully");
  } catch (error) {
    console.error("Error sending password reset code:", error);
  }
};

router.post("/send-reset-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Email is required" });
  }

  try {
    const resetCode = await generateResetCode(email);
    await sendResetCode(email, resetCode);

    res.json({ success: true, resetCode });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Failed to send reset code" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, resetCode, newPassword, confirmPassword } = req.body;

    if (!email || !resetCode || !newPassword || !confirmPassword) {
      return res.status(422).json({ error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const resetCodeDoc = await ResetCode.findOne({ email, resetCode });

    if (!resetCodeDoc) {
      return res.status(404).json({ message: "Invalid reset code" });
    }

    const currentTime = new Date().getTime();
    if (resetCodeDoc.expireIn < currentTime) {
      return res.status(400).json({ message: "Reset code expired" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Email is required" });
  }

  const verificationOTP = await generateOTP(email);

  try {
    await sendVerificationOTP(email, verificationOTP);

    res.json({ success: true, otp: verificationOTP });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/verify-otp", upload.single("image"), async (req, res) => {
  const { name, email, number, password, otp } = req.body;

  if (!name || !email || !number || !password || !otp) {
    return res.status(422).json({ error: "All fields and OTP are required" });
  }

  try {
    const isOTPValid = await verifyOTP(email, otp);

    if (!isOTPValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const pic = await cloudinary.uploader.upload(req.file.path);

    const user = new User({
      name,
      email,
      number,
      password,
      image: pic.secure_url,
      otp,
    });

    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (err) {
    console.log("Error:", err);
    return res.status(422).send({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Email or Password is not entered!" });
  }
  const savedUser = await User.findOne({ email: email });

  if (!savedUser) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }

  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        res.send({ token });
      } else {
        return res.status(422).json({ error: "Invalid Password" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/userdata", (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in!" });
  }
  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must be logged in!" });
    }
    const { _id } = payload;
    User.findById(_id).then((userData) => {
      res.status(200).send({
        message: "Data fetched successfully!",
        user: userData,
      });
    });
  });
});

router.post("/addReview", async (req, res) => {
  try {
    console.log(req.body);
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { feedback } = req.body;
    const newFeedback = new Feedback({
      feedback,
      user: decoded._id,
    });
    await newFeedback.save();
    res.status(201).json({
      feedbackData: newFeedback,
    });
  } catch (error) {
    controllerError(error, res, "Error occurred");
  }
});

router.put("/updateProfile", upload.single("image"), async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    const { name, number } = req.body;

    const pic = await cloudinary.uploader.upload(req.file.path);

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { name, number, image: pic.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "User profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/change-password", async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Authorization header not present" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({
      message: "User password updated successfully.",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        number: updatedUser.number,
        profilepic: updatedUser.profilepic,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/classified", async (req, res) => {
  try {
    const data = await Classified.find();
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

setInterval(() => {
  console.log("Running API...");
  const http = require("http");
  http
    .get("http://localhost:3000/classified", (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (err) => {
      console.error("Error making request to API...", err);
    });
}, 1 * 60 * 1000);

module.exports = router;
