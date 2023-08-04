const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dwp2dsoc3",
  api_key: "521688749556743",
  api_secret: "1KcRBa3idIk4rWP_bnAbPFrYG6o",
});

module.exports = {
  cloudinary: cloudinary,
};
