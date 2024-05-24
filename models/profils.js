const mongoose = require("mongoose");

// const photoSchema = mongoose.Schema({
//   url: String,
//   created_at: Date,
// });



const avisSchema = mongoose.Schema({
  note: Number,
  content: String,
  created_at: Date,
  user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "profils" }],
});

const historiqueSchema = mongoose.Schema({
  url: String,
  name: String,
  Statue: String,
});

const profilSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  token: String,
  birthDate: Date,
  city: String,
  role: {
    type: String,
    enum: ["garder", "faire garder"],
    required: false,
  },
  photo: String,
  profilAnimal: [{ type: mongoose.Schema.Types.ObjectId, ref: "animals" }],
  avis: [avisSchema],
  historique: [historiqueSchema],
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "profils" }],
  likeReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "profils" }],
});

const Profil = mongoose.model("profils", profilSchema);


module.exports = Profil;
