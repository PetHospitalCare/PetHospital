mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        dateOfBirth:{
            type: Date
        },
        type: { 
            type: String, 
            enum: ["Dog", "Cat"],
            required: true 
        },
        species: { 
            type: String, 
            required: true 
        },
        profile_id: { 
            type: String 
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema); 