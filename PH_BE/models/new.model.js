const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: {
    url: { type: String },
    publicId: { type: String },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  }
},
  { timestamps: true }
);

module.exports = mongoose.model('New', newSchema);