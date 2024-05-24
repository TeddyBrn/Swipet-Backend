const mongoose = require("mongoose");

const AnimalSchema = mongoose.Schema({
    name: String,
    birthDate: Date,
    animalType: {
      type: String,
      enum: ["Chien", "Chat", "Lapin", "Hamster"],
      required: true,
    },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    bio: String,
    detail: String,
    photoUrl: String,
  });


const Animal = mongoose.model("animals", AnimalSchema);

module.exports = Animal;