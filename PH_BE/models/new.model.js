const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
    title: String,
    content: String,
  },
  {timestamps: true}
);
  
module.exports = mongoose.model('New', newSchema);