const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log("Cloudinary Config Debug:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Found" : "Missing");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Found" : "Missing");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
